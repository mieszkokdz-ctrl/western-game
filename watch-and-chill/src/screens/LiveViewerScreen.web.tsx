import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Peer, { type MediaConnection } from 'peerjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { LIVE_ICE_SERVERS } from '../utils/liveRtcConfig';

type Status = 'connecting' | 'watching' | 'ended' | 'not-found';

// Generous enough to allow a TURN relay negotiation to complete on a slow
// mobile connection, not just a fast direct STUN path.
const CONNECT_TIMEOUT_MS = 20000;

export function getLiveId(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('live');
}

export default function LiveViewerScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const callRef = useRef<MediaConnection | null>(null);
  const connectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const liveId = useMemo(() => getLiveId(), []);
  const [status, setStatus] = useState<Status>('connecting');
  const [retryCount, setRetryCount] = useState(0);
  // Mobile browsers block autoplay of unmuted media unless play() is called
  // directly inside a user tap — ours runs later, after the WebRTC handshake
  // completes, so it gets silently rejected and the video just stays paused
  // on a black frame. Starting muted makes autoplay reliable; viewers can
  // unmute with a tap afterwards (itself a real user gesture, so it works).
  const [muted, setMuted] = useState(true);
  const [needsTap, setNeedsTap] = useState(false);
  const [playError, setPlayError] = useState('');

  useEffect(() => {
    if (!liveId) {
      setStatus('not-found');
      return;
    }

    setStatus('connecting');
    let cancelled = false;
    const peer = new Peer({ config: { iceServers: LIVE_ICE_SERVERS } });
    peerRef.current = peer;

    // Cleared once video is actually playing (see handleVideoPlaying), so
    // this only ever fires when the connection genuinely never came through.
    connectTimeoutRef.current = setTimeout(() => {
      if (!cancelled) setStatus('not-found');
    }, CONNECT_TIMEOUT_MS);

    peer.on('open', () => {
      if (cancelled) return;
      // A receive-only call still needs a MediaStream argument, but an empty
      // one contributes zero tracks — with nothing added, the resulting SDP
      // offer has no video/audio section at all, so there is nothing for the
      // broadcaster's answer to attach their camera stream to and no video
      // ever arrives. offerToReceiveVideo/Audio explicitly requests recvonly
      // media sections in the offer so the answer actually has something to
      // fill in.
      // `constraints` is read by PeerJS at runtime (passed straight through
      // to RTCPeerConnection#createOffer) but missing from its CallOption
      // type — cast to pass it through.
      const call = peer.call(liveId, new MediaStream(), {
        constraints: { offerToReceiveAudio: true, offerToReceiveVideo: true },
      } as Parameters<Peer['call']>[2]);
      callRef.current = call;
      // "Watching" is only ever declared from the video element's own
      // `playing` event (see the <video> below) — that's the one signal
      // that's actually true across every browser: frames are rendering.
      // WebRTC's iceConnectionState is a tempting alternative but not a
      // reliable proxy for it — some browsers/TURN paths never land
      // precisely on "connected"/"completed" even while media is flowing
      // fine, which was blocking the UI from ever leaving "Łączenie...".
      call.on('stream', remoteStream => {
        if (cancelled || !videoRef.current) return;
        // Force the property directly rather than relying only on the JSX
        // `muted` prop — React doesn't always sync that attribute to the
        // live DOM property in time for the element's own autoplay to see it.
        videoRef.current.muted = true;
        videoRef.current.srcObject = remoteStream;
        // The `autoPlay` attribute already asks the browser to start playing
        // as soon as srcObject has enough data — calling .play() ourselves
        // in the same tick races that built-in attempt and can get one of
        // the two calls aborted ("interrupted because the media was removed
        // from the document"). Give the attribute a moment to work first,
        // and only step in manually if it's genuinely still paused.
        const video = videoRef.current;
        const attemptPlay = (isRetry: boolean) => {
          if (cancelled || !video.paused) return;
          video.play().catch((err: DOMException) => {
            if (cancelled) return;
            // AbortError means something else interrupted this specific
            // play() call (not a real autoplay-policy block) — one retry is
            // usually enough for it to settle. Anything else (most commonly
            // NotAllowedError) is a genuine block that needs a real tap.
            if (err.name === 'AbortError' && !isRetry) {
              setTimeout(() => attemptPlay(true), 500);
              return;
            }
            setNeedsTap(true);
            setPlayError(`${err.name}: ${err.message}`);
          });
        };
        setTimeout(() => attemptPlay(false), 500);
      });
      // Still useful as a fast, unambiguous failure signal even though
      // "connected" isn't used to drive the UI anymore.
      call.on('iceStateChanged', state => {
        if (!cancelled && state === 'failed') setStatus('not-found');
      });
      call.on('close', () => {
        if (!cancelled) setStatus('ended');
      });
      call.on('error', () => {
        if (!cancelled) setStatus('not-found');
      });
    });

    peer.on('disconnected', () => {
      if (!cancelled) peer.reconnect();
    });

    peer.on('error', err => {
      console.warn('Peer error', err);
      if (!cancelled) setStatus('not-found');
    });

    return () => {
      cancelled = true;
      if (connectTimeoutRef.current != null) clearTimeout(connectTimeoutRef.current);
      callRef.current?.close();
      peer.destroy();
    };
  }, [liveId, retryCount]);

  const goHome = () => {
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { screen: 'Home' } }] });
  };

  if (status === 'not-found' || status === 'ended') {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.messageTitle}>
          {status === 'ended' ? 'Transmisja się zakończyła' : 'Nie można znaleźć tej transmisji'}
        </Text>
        <Text style={styles.messageText}>
          {status === 'ended'
            ? 'Nadawca zakończył transmisję na żywo.'
            : 'Ten link do transmisji live jest nieprawidłowy, transmisja się skończyła, albo nadawca chwilowo stracił połączenie — spróbuj ponownie.'}
        </Text>
        {status === 'not-found' && liveId && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setRetryCount(c => c + 1)}
            testID="live-viewer-retry-button"
          >
            <Text style={styles.retryButtonText}>Spróbuj ponownie</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.homeButton} onPress={goHome} testID="live-viewer-home-button">
          <Text style={styles.homeButtonText}>Przejdź do Watch&Chill</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // A plain native onClick, not TouchableOpacity's onPress — Safari/Chrome's
  // mobile autoplay policy only allows play() when it's called synchronously
  // inside a real browser click event, and TouchableOpacity's gesture
  // responder system adds enough indirection that the browser no longer
  // treats the resulting play() call as directly gesture-triggered.
  const handleTapToPlay = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = muted;
    videoRef.current
      .play()
      .then(() => {
        setNeedsTap(false);
        setPlayError('');
      })
      .catch((err: DOMException) => setPlayError(`${err.name}: ${err.message}`));
  };

  // The one ground-truth signal that video is actually visible: the browser
  // itself fires this only once real frames are being rendered.
  const handleVideoPlaying = () => {
    if (connectTimeoutRef.current != null) clearTimeout(connectTimeoutRef.current);
    setNeedsTap(false);
    setStatus('watching');
  };

  return (
    <View style={styles.container}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        onPlaying={handleVideoPlaying}
        onClick={needsTap ? handleTapToPlay : undefined}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {needsTap && (
        <div
          onClick={handleTapToPlay}
          data-testid="live-viewer-tap-to-play"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            backgroundColor: 'rgba(0,0,0,0.35)',
            cursor: 'pointer',
          }}
        >
          <Text style={styles.tapToPlayText}>▶ Dotknij, aby odtworzyć</Text>
          {playError ? <Text style={styles.tapToPlayError}>{playError}</Text> : null}
        </div>
      )}

      <SafeAreaView style={styles.topBar} edges={['top']}>
        <TouchableOpacity style={styles.iconButton} onPress={goHome} testID="live-viewer-close-button">
          <Text style={styles.iconButtonText}>✕</Text>
        </TouchableOpacity>
        {status === 'watching' && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        )}
        {status === 'connecting' && (
          <View style={styles.connectingBadge}>
            <Text style={styles.connectingText}>Łączenie...</Text>
          </View>
        )}
        {status === 'watching' ? (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setMuted(m => !m)}
            testID="live-viewer-mute-button"
          >
            <Text style={styles.iconButtonText}>{muted ? '🔇' : '🔊'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  messageContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  messageTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  messageText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  homeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  homeButtonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  retryButton: {
    marginBottom: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.border,
  },
  retryButtonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    color: colors.text,
    fontSize: 18,
  },
  liveBadge: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  liveBadgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  connectingBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  connectingText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  tapToPlayText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
  },
  tapToPlayError: {
    color: colors.textMuted,
    fontSize: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
});

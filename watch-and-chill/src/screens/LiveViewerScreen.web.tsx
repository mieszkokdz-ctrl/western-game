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

  useEffect(() => {
    if (!liveId) {
      setStatus('not-found');
      return;
    }

    setStatus('connecting');
    let cancelled = false;
    const peer = new Peer({ config: { iceServers: LIVE_ICE_SERVERS } });
    peerRef.current = peer;

    // Cleared as soon as the remote stream actually attaches, so this only
    // ever fires when the connection genuinely never came through.
    const timeout = setTimeout(() => {
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
      // 'stream' only means signaling finished and a track was negotiated —
      // it fires before the underlying connection is actually up, so relying
      // on it alone can show a "LIVE" badge over a frame that never arrives
      // if the peer-to-peer/TURN path never truly connects. Waiting for
      // iceStateChanged to report connected/completed means "watching" only
      // ever means media is genuinely flowing.
      call.on('stream', remoteStream => {
        if (cancelled || !videoRef.current) return;
        videoRef.current.srcObject = remoteStream;
        videoRef.current.play().catch(() => {
          // Extremely unlikely once muted, but if it still gets blocked,
          // needsTap lets the user start it with a direct tap instead.
          if (!cancelled) setNeedsTap(true);
        });
      });
      call.on('iceStateChanged', state => {
        if (cancelled) return;
        if (state === 'connected' || state === 'completed') {
          clearTimeout(timeout);
          setStatus('watching');
        } else if (state === 'failed') {
          setStatus('not-found');
        }
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
      clearTimeout(timeout);
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

  const handleTapToPlay = () => {
    videoRef.current
      ?.play()
      .then(() => setNeedsTap(false))
      .catch(() => {});
  };

  return (
    <View style={styles.container}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
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
        <TouchableOpacity style={styles.tapToPlayOverlay} onPress={handleTapToPlay} testID="live-viewer-tap-to-play">
          <Text style={styles.tapToPlayText}>▶ Dotknij, aby odtworzyć</Text>
        </TouchableOpacity>
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
  tapToPlayOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
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
});

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Peer, { type DataConnection, type MediaConnection } from 'peerjs';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LiveChatOverlay, { type LiveChatMessage } from '../components/LiveChatOverlay';
import { useUserProfile } from '../context/UserProfileContext';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { LIVE_ICE_SERVERS } from '../utils/liveRtcConfig';

type Status = 'connecting' | 'live' | 'ended' | 'error';

// Keeps memory/render cost bounded on a long-running stream.
const MAX_CHAT_MESSAGES = 200;

function makeLiveId(): string {
  return `wc-live-${Math.random().toString(36).slice(2, 10)}`;
}

function makeMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function LiveBroadcastScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { username } = useUserProfile();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const startedAtRef = useRef(0);
  const activeCallsRef = useRef<Set<MediaConnection>>(new Set());
  const dataConnectionsRef = useRef<Map<string, DataConnection>>(new Map());

  const [status, setStatus] = useState<Status>('connecting');
  const [liveId, setLiveId] = useState('');
  const [viewerCount, setViewerCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [linkCopied, setLinkCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);

  const addMessage = (msg: LiveChatMessage) => {
    setMessages(prev => [...prev, msg].slice(-MAX_CHAT_MESSAGES));
  };

  // Every viewer only has a direct data connection to the broadcaster, not
  // to each other, so a message from one viewer has to be relayed through
  // here to reach everyone else watching.
  const relayMessage = (msg: LiveChatMessage, excludePeerId?: string) => {
    dataConnectionsRef.current.forEach((conn, peerId) => {
      if (peerId !== excludePeerId && conn.open) conn.send(msg);
    });
  };

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'user' } },
          audio: true,
        });
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }

        const id = makeLiveId();
        const peer = new Peer(id, { config: { iceServers: LIVE_ICE_SERVERS } });
        peerRef.current = peer;

        peer.on('open', () => {
          if (cancelled) return;
          setLiveId(id);
          setStatus('live');
          startedAtRef.current = Date.now();
        });

        peer.on('call', call => {
          if (!streamRef.current) return;
          call.answer(streamRef.current);
          // Counted as soon as the call is answered. Gating this on
          // iceConnectionState reaching "connected"/"completed" sounds more
          // accurate, but that event doesn't reliably land on those exact
          // states on every browser/TURN path even once media is genuinely
          // flowing — it was leaving the count stuck at 0 for real viewers.
          activeCallsRef.current.add(call);
          setViewerCount(activeCallsRef.current.size);
          call.on('close', () => {
            activeCallsRef.current.delete(call);
            setViewerCount(activeCallsRef.current.size);
          });
        });

        // Each viewer opens a data connection (separate from their media
        // call) to send chat messages. The broadcaster is the only peer
        // everyone is directly connected to, so it also relays each
        // incoming message out to every other connected viewer.
        peer.on('connection', dataConn => {
          dataConnectionsRef.current.set(dataConn.peer, dataConn);
          dataConn.on('data', data => {
            const msg = data as LiveChatMessage;
            addMessage(msg);
            relayMessage(msg, dataConn.peer);
          });
          dataConn.on('close', () => {
            dataConnectionsRef.current.delete(dataConn.peer);
          });
        });

        // The connection to the signaling server can drop on its own — e.g.
        // the phone briefly loses signal, or the browser throttles the tab
        // while the user switches apps to send the share link. Without this,
        // the live ID silently becomes unreachable and every viewer who taps
        // the link afterwards sees "not found" even though the broadcaster
        // thinks they're still live. Reconnecting keeps the same ID working.
        peer.on('disconnected', () => {
          if (!cancelled) peer.reconnect();
        });

        peer.on('error', err => {
          console.warn('Peer error', err);
          if (!cancelled) {
            setErrorMessage('Nie udało się połączyć z serwerem transmisji na żywo. Spróbuj ponownie.');
            setStatus('error');
          }
        });
      } catch (err) {
        console.warn('getUserMedia failed', err);
        if (!cancelled) {
          setErrorMessage('Watch&Chill potrzebuje dostępu do aparatu i mikrofonu, aby rozpocząć transmisję.');
          setStatus('error');
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(track => track.stop());
      activeCallsRef.current.forEach(call => call.close());
      activeCallsRef.current.clear();
      dataConnectionsRef.current.forEach(conn => conn.close());
      dataConnectionsRef.current.clear();
      peerRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (status !== 'live') return;
    const interval = setInterval(() => {
      setElapsed((Date.now() - startedAtRef.current) / 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const handleEnd = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    activeCallsRef.current.forEach(call => call.close());
    activeCallsRef.current.clear();
    dataConnectionsRef.current.forEach(conn => conn.close());
    dataConnectionsRef.current.clear();
    peerRef.current?.destroy();
    setStatus('ended');
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { screen: 'Home' } }] });
  };

  const handleSendChat = (text: string) => {
    const msg: LiveChatMessage = { id: makeMessageId(), author: username, text };
    addMessage(msg);
    relayMessage(msg);
  };

  const handleShare = async () => {
    if (!liveId) return;
    const shareUrl = new URL(window.location.href);
    shareUrl.search = `?live=${encodeURIComponent(liveId)}`;
    const shareData = {
      title: 'Watch&Chill',
      text: `${username} nadaje live na Watch&Chill!`,
      url: shareUrl.toString(),
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled the share sheet — nothing to do.
      }
      return;
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 1800);
      } catch {
        // Clipboard access denied — nothing more we can do.
      }
    }
  };

  if (status === 'error') {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Nie udało się rozpocząć transmisji</Text>
        <Text style={styles.permissionText}>{errorMessage}</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={() => navigation.goBack()}>
          <Text style={styles.permissionButtonText}>Wróć</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'scaleX(-1)',
        }}
      />

      <SafeAreaView style={styles.topBar} edges={['top']}>
        <TouchableOpacity style={styles.iconButton} onPress={handleEnd} testID="live-close-button">
          <Text style={styles.iconButtonText}>✕</Text>
        </TouchableOpacity>

        {status === 'live' && (
          <View style={styles.statusRow}>
            <View style={styles.liveBadge}>
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
            <Text style={styles.elapsedText}>{formatElapsed(elapsed)}</Text>
            <View style={styles.viewerBadge}>
              <Text style={styles.viewerBadgeText}>👁 {viewerCount}</Text>
            </View>
          </View>
        )}

        {status === 'connecting' && (
          <View style={styles.statusRow}>
            <Text style={styles.connectingText}>Łączenie...</Text>
          </View>
        )}

        {status === 'live' ? (
          <TouchableOpacity style={styles.iconButton} onPress={handleShare} testID="live-share-button">
            <Text style={styles.iconButtonText}>↗️</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </SafeAreaView>

      {linkCopied && (
        <View style={styles.toast} pointerEvents="none">
          <Text style={styles.toastText}>Link skopiowany</Text>
        </View>
      )}

      {status === 'live' && (
        <SafeAreaView style={styles.chatArea} edges={['bottom']} pointerEvents="box-none">
          <LiveChatOverlay messages={messages} onSend={handleSendChat} />
        </SafeAreaView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  permissionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  permissionButtonText: {
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  liveBadge: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  liveBadgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  elapsedText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  viewerBadge: {
    paddingHorizontal: 4,
  },
  viewerBadgeText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  toast: {
    position: 'absolute',
    top: '45%',
    left: 40,
    right: 40,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  toastText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  chatArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

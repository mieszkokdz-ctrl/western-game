import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecordingTimerRing from '../components/RecordingTimerRing';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Facing = 'user' | 'environment';

const MAX_RECORDING_SECONDS = 60;

function pickMimeType(): string | undefined {
  const candidates = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4'];
  for (const type of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported?.(type)) return type;
  }
  return undefined;
}

export default function CreateScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [facing, setFacing] = useState<Facing>('user');
  const [isRecording, setIsRecording] = useState(false);
  const [permissionState, setPermissionState] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const recordingStartRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = () => {
    if (timerRef.current != null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setElapsedSeconds(0);
  };

  const stopStream = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  };

  const startStream = async () => {
    // Release the current camera before requesting the other-facing one —
    // most devices only allow one active camera stream at a time, so asking
    // for a new stream while the old one is still open can hang or fail.
    stopStream();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facing } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setPermissionState('granted');
    } catch (err) {
      console.warn('getUserMedia failed', err);
      setPermissionState('denied');
    }
  };

  useEffect(() => {
    startStream();
    return () => {
      stopStream();
      stopTimer();
      recorderRef.current?.stop();
    };
  }, [facing]);

  const handleRecordPress = () => {
    if (!streamRef.current) return;

    if (isRecording) {
      recorderRef.current?.stop();
      return;
    }

    chunksRef.current = [];
    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(streamRef.current, mimeType ? { mimeType } : undefined);
    recorder.ondataavailable = event => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      stopTimer();
      const blob = new Blob(chunksRef.current, { type: mimeType ?? 'video/webm' });
      const uri = URL.createObjectURL(blob);
      setIsRecording(false);
      navigation.replace('Post', { uri });
    };
    recorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);

    recordingStartRef.current = Date.now();
    setElapsedSeconds(0);
    timerRef.current = setInterval(() => {
      const seconds = (Date.now() - recordingStartRef.current) / 1000;
      if (seconds >= MAX_RECORDING_SECONDS) {
        setElapsedSeconds(MAX_RECORDING_SECONDS);
        recorderRef.current?.stop();
      } else {
        setElapsedSeconds(seconds);
      }
    }, 200);
  };

  if (permissionState === 'idle') {
    return <View style={styles.container} />;
  }

  if (permissionState === 'denied') {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Nagraj swojego shorta</Text>
        <Text style={styles.permissionText}>
          Watch&Chill potrzebuje dostępu do aparatu i mikrofonu, aby nagrać Twój filmik. Sprawdź uprawnienia w
          ustawieniach przeglądarki i spróbuj ponownie.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={startStream}>
          <Text style={styles.permissionButtonText}>Spróbuj ponownie</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Anuluj</Text>
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
          transform: facing === 'user' ? 'scaleX(-1)' : undefined,
        }}
      />

      <SafeAreaView style={styles.topBar} edges={['top']}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()} disabled={isRecording}>
          <Text style={styles.iconButtonText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setFacing(prev => (prev === 'user' ? 'environment' : 'user'))}
          disabled={isRecording}
        >
          <Text style={styles.iconButtonText}>🔄</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
        <Text style={styles.hint}>
          {isRecording ? 'Nagrywanie... dotknij, aby zakończyć' : 'Dotknij, aby nagrać (max 60s)'}
        </Text>
        <View style={styles.recordButtonWrap}>
          {isRecording && (
            <RecordingTimerRing elapsedSeconds={elapsedSeconds} durationSeconds={MAX_RECORDING_SECONDS} size={94} />
          )}
          <TouchableOpacity style={styles.recordOuter} onPress={handleRecordPress} testID="record-button">
            <View style={[styles.recordInner, isRecording && styles.recordInnerActive]} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
  cancelButton: {
    marginTop: 16,
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: 20,
  },
  hint: {
    color: colors.text,
    fontSize: 13,
    marginBottom: 16,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 4,
  },
  recordButtonWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordOuter: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
  },
  recordInnerActive: {
    width: 30,
    height: 30,
    borderRadius: 6,
  },
});

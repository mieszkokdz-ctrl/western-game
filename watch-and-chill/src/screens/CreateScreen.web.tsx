import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { FaceLandmarker } from '@mediapipe/tasks-vision';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecordingTimerRing from '../components/RecordingTimerRing';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { drawFaceEffect, FACE_EFFECTS } from '../utils/faceEffects';
import { getFaceLandmarker } from '../utils/faceLandmarker';
import { VIDEO_FILTERS } from '../utils/videoFilters';

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const rafRef = useRef<number | null>(null);
  const activeEffectIdRef = useRef(VIDEO_FILTERS[0].id);
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);

  const [facing, setFacing] = useState<Facing>('user');
  const [isRecording, setIsRecording] = useState(false);
  const [permissionState, setPermissionState] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activeEffectId, setActiveEffectId] = useState(VIDEO_FILTERS[0].id);
  const [faceEffectsLoading, setFaceEffectsLoading] = useState(false);
  const [faceEffectsError, setFaceEffectsError] = useState(false);
  const recordingStartRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    activeEffectIdRef.current = activeEffectId;
  }, [activeEffectId]);

  const handleSelectEffect = async (id: string) => {
    const isFaceEffect = FACE_EFFECTS.some(f => f.id === id);
    if (isFaceEffect && !faceLandmarkerRef.current) {
      setFaceEffectsLoading(true);
      try {
        faceLandmarkerRef.current = await getFaceLandmarker();
        setFaceEffectsError(false);
      } catch (err) {
        console.warn('Failed to load face effects', err);
        setFaceEffectsLoading(false);
        setFaceEffectsError(true);
        return;
      }
      setFaceEffectsLoading(false);
    }
    setActiveEffectId(id);
  };

  // Draws the live camera feed onto a canvas every frame, with the chosen
  // color filter or face-tracking effect baked into the pixels — a CSS
  // filter on the <video> preview would only be cosmetic and wouldn't show
  // up in the actual recording, since MediaRecorder captures the raw camera
  // stream, not the rendered DOM. This canvas becomes both the visible
  // preview and the source for recording, so what's seen while filming is
  // exactly what gets saved.
  useEffect(() => {
    const draw = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.videoWidth > 0) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const colorFilter = VIDEO_FILTERS.find(f => f.id === activeEffectIdRef.current);
          const faceEffect = FACE_EFFECTS.find(f => f.id === activeEffectIdRef.current);
          ctx.filter = colorFilter?.css ?? 'none';
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          if (faceEffect && faceLandmarkerRef.current) {
            ctx.filter = 'none';
            const result = faceLandmarkerRef.current.detectForVideo(video, performance.now());
            drawFaceEffect(ctx, result, faceEffect.id, canvas.width, canvas.height);
          }
        }
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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
    if (!streamRef.current || !canvasRef.current) return;

    if (isRecording) {
      recorderRef.current?.stop();
      return;
    }

    // Record the filtered canvas (video) combined with the real microphone
    // audio (canvas.captureStream carries no audio of its own).
    const canvasStream = canvasRef.current.captureStream(30);
    const recordedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...streamRef.current.getAudioTracks(),
    ]);

    chunksRef.current = [];
    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(recordedStream, mimeType ? { mimeType } : undefined);
    recorder.ondataavailable = event => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      stopTimer();
      canvasStream.getTracks().forEach(track => track.stop());
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
      {/* Hidden — only used as the live frame source drawn onto the canvas
          below, which is the actual visible preview and recording source. */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
      />
      <canvas
        ref={canvasRef}
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
        {!isRecording && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterList}
            contentContainerStyle={styles.filterListContent}
          >
            {VIDEO_FILTERS.map(filter => (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterChip, activeEffectId === filter.id && styles.filterChipActive]}
                onPress={() => handleSelectEffect(filter.id)}
                testID={`filter-${filter.id}`}
              >
                <Text style={[styles.filterChipText, activeEffectId === filter.id && styles.filterChipTextActive]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
            {FACE_EFFECTS.map(effect => (
              <TouchableOpacity
                key={effect.id}
                style={[styles.filterChip, activeEffectId === effect.id && styles.filterChipActive]}
                onPress={() => handleSelectEffect(effect.id)}
                testID={`filter-${effect.id}`}
              >
                <Text style={[styles.filterChipText, activeEffectId === effect.id && styles.filterChipTextActive]}>
                  {effect.icon} {effect.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {faceEffectsLoading && (
          <Text style={styles.effectStatusText}>Ładowanie filtra twarzy...</Text>
        )}
        {faceEffectsError && (
          <Text style={styles.effectStatusText}>Nie udało się załadować filtra twarzy. Spróbuj ponownie.</Text>
        )}
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
  filterList: {
    maxWidth: '100%',
    marginBottom: 14,
  },
  filterListContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: colors.text,
  },
  filterChipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: colors.text,
  },
  effectStatusText: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
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

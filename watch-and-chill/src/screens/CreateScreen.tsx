import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CameraType, CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

export default function CreateScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const hasPermissions = cameraPermission?.granted && micPermission?.granted;

  const requestAll = async () => {
    await requestCameraPermission();
    await requestMicPermission();
  };

  const handleRecordPress = async () => {
    if (!cameraRef.current) return;
    if (isRecording) {
      cameraRef.current.stopRecording();
      return;
    }
    setIsRecording(true);
    try {
      const video = await cameraRef.current.recordAsync({ maxDuration: 60 });
      if (video?.uri) {
        navigation.replace('Post', { uri: video.uri });
      }
    } finally {
      setIsRecording(false);
    }
  };

  if (!cameraPermission || !micPermission) {
    return <View style={styles.container} />;
  }

  if (!hasPermissions) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Nagraj swojego shorta</Text>
        <Text style={styles.permissionText}>
          Watch&Chill potrzebuje dostępu do aparatu i mikrofonu, aby nagrać Twój filmik.
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestAll}>
          <Text style={styles.permissionButtonText}>Zezwól na dostęp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Anuluj</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} mode="video" />

      <SafeAreaView style={styles.topBar} edges={['top']}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()} disabled={isRecording}>
          <Text style={styles.iconButtonText}>✕</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setFacing(prev => (prev === 'back' ? 'front' : 'back'))}
          disabled={isRecording}
        >
          <Text style={styles.iconButtonText}>🔄</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
        <Text style={styles.hint}>{isRecording ? 'Nagrywanie... dotknij, aby zakończyć' : 'Dotknij, aby nagrać (max 60s)'}</Text>
        <TouchableOpacity style={styles.recordOuter} onPress={handleRecordPress} testID="record-button">
          <View style={[styles.recordInner, isRecording && styles.recordInnerActive]} />
        </TouchableOpacity>
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

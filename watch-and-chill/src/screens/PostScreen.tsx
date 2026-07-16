import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserVideos } from '../context/UserVideosContext';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Route = { key: string; name: 'Post'; params: RootStackParamList['Post'] };

export default function PostScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Route>();
  const { addVideo } = useUserVideos();
  const [caption, setCaption] = useState('');

  const player = useVideoPlayer(route.params.uri, p => {
    p.loop = true;
    p.play();
  });

  const handlePublish = () => {
    addVideo(route.params.uri, caption);
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { screen: 'Home' } }] });
  };

  return (
    <View style={styles.container}>
      <VideoView player={player} style={StyleSheet.absoluteFill} nativeControls={false} contentFit="cover" />

      <SafeAreaView style={styles.topBar} edges={['top']}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.bottomPanel}
      >
        <SafeAreaView edges={['bottom']}>
          <TextInput
            value={caption}
            onChangeText={setCaption}
            placeholder="Dodaj opis... #watchandchill"
            placeholderTextColor="rgba(255,255,255,0.6)"
            style={styles.captionInput}
            multiline
            maxLength={150}
          />
          <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
            <Text style={styles.publishButtonText}>Opublikuj</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: colors.text,
    fontSize: 24,
    marginTop: -2,
  },
  bottomPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  captionInput: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    color: colors.text,
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 10,
    maxHeight: 80,
  },
  publishButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  publishButtonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
});

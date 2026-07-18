import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Linking,
  Modal,
  PanResponder,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FeedItem from '../components/FeedItem';
import { useVisibleFeed } from '../hooks/useVisibleFeed';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

// Placeholder until the app has a real Google Play listing.
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.watchandchill.app';

export function getSharedVideoId(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('v');
}

export default function SharedVideoScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const windowHeight = Dimensions.get('window').height;
  const feed = useVisibleFeed();
  const videoId = useMemo(() => getSharedVideoId(), []);
  const video = useMemo(() => feed.find(v => v.id === videoId), [feed, videoId]);
  const [installPromptVisible, setInstallPromptVisible] = useState(false);

  // With only one video, the screen has nothing to physically scroll, so
  // browsers never fire scroll events for a swipe here — a raw touch
  // gesture is tracked instead, independent of any scroll container.
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, gestureState) => Math.abs(gestureState.dy) > 12,
      onPanResponderRelease: (_, gestureState) => {
        if (Math.abs(gestureState.dy) > 40) {
          setInstallPromptVisible(true);
        }
      },
    })
  ).current;

  if (!video) {
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs', params: { screen: 'Home' } }] });
    return null;
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <StatusBar barStyle="light-content" />
      <FeedItem title={video} active height={windowHeight} />

      <Modal
        visible={installPromptVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setInstallPromptVisible(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.card}>
            <Text style={styles.title}>Chcesz zobaczyć więcej?</Text>
            <Text style={styles.message}>
              Aby przewijać kolejne filmy, zainstaluj aplikację Watch&Chill ze sklepu Play.
            </Text>
            <TouchableOpacity
              style={styles.installButton}
              onPress={() => Linking.openURL(PLAY_STORE_URL)}
              testID="install-app-button"
            >
              <Text style={styles.installButtonText}>Zainstaluj z Google Play</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.laterButton}
              onPress={() => setInstallPromptVisible(false)}
              testID="install-later-button"
            >
              <Text style={styles.laterButtonText}>Może później</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  card: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 36,
    alignItems: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  installButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  installButtonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  laterButton: {
    marginTop: 14,
    paddingVertical: 8,
  },
  laterButtonText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});

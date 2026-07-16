import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWatchlist } from '../context/WatchlistContext';
import { getTitleById } from '../data/catalog';
import type { RootStackParamList } from '../navigation/types';
import { colors, gradients } from '../theme/colors';

type Route = { key: string; name: 'Details'; params: RootStackParamList['Details'] };

export default function DetailsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Route>();
  const { isSaved, toggle } = useWatchlist();
  const title = getTitleById(route.params.titleId);

  if (!title) return null;

  const saved = isSaved(title.id);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.backdropWrap}>
          <Image source={{ uri: title.backdrop }} style={styles.backdrop} />
          <LinearGradient colors={gradients.posterFade} style={StyleSheet.absoluteFill} />
          <SafeAreaView edges={['top']} style={styles.topBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>‹</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{title.title}</Text>
          <Text style={styles.meta}>
            {title.year} · {title.duration} · {title.category}
          </Text>

          <TouchableOpacity
            style={styles.playButton}
            onPress={() => navigation.navigate('Player', { titleId: title.id })}
          >
            <Text style={styles.playButtonText}>▶ Odtwórz</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.listButton} onPress={() => toggle(title.id)}>
            <Text style={styles.listButtonText}>{saved ? '✓ Na liście' : '+ Dodaj do listy'}</Text>
          </TouchableOpacity>

          <Text style={styles.description}>{title.description}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backdropWrap: {
    height: 260,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  topBar: {
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
  content: {
    padding: 16,
    marginTop: -40,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 6,
  },
  playButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 18,
  },
  playButtonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 16,
  },
  listButton: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  listButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 15,
  },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 20,
  },
});

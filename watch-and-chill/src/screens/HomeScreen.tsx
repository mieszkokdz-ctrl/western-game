import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CatalogRow from '../components/CatalogRow';
import { catalog, categories, type Title } from '../data/catalog';
import type { RootStackParamList } from '../navigation/types';
import { colors, gradients } from '../theme/colors';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const featured = catalog[0];

  const rows = useMemo(
    () => categories.map(category => ({ category, titles: catalog.filter(t => t.category === category) })),
    []
  );

  const openDetails = (title: Title) => navigation.navigate('Details', { titleId: title.id });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image source={{ uri: featured.backdrop }} style={styles.heroImage} />
          <LinearGradient colors={gradients.heroFade} style={StyleSheet.absoluteFill} />
          <SafeAreaView edges={['top']} style={styles.heroTopBar}>
            <Text style={styles.brand}>
              watch<Text style={styles.brandAccent}>&</Text>chill
            </Text>
          </SafeAreaView>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{featured.title}</Text>
            <Text style={styles.heroMeta}>
              {featured.year} · {featured.duration} · {featured.category}
            </Text>
            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => navigation.navigate('Player', { titleId: featured.id })}
              >
                <Text style={styles.playButtonText}>▶ Odtwórz</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.infoButton} onPress={() => openDetails(featured)}>
                <Text style={styles.infoButtonText}>ⓘ Informacje</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.rows}>
          {rows.map(row => (
            <CatalogRow
              key={row.category}
              heading={row.category}
              titles={row.titles}
              onPressTitle={openDetails}
            />
          ))}
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
  hero: {
    height: 480,
    justifyContent: 'flex-end',
  },
  heroImage: {
    ...StyleSheet.absoluteFill,
  },
  heroTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  brand: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandAccent: {
    color: colors.primary,
  },
  heroContent: {
    padding: 16,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
  },
  heroMeta: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 6,
  },
  heroActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  playButton: {
    backgroundColor: colors.text,
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  playButtonText: {
    color: colors.background,
    fontWeight: '700',
    fontSize: 15,
  },
  infoButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  infoButtonText: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 15,
  },
  rows: {
    paddingTop: 20,
    paddingBottom: 40,
  },
});

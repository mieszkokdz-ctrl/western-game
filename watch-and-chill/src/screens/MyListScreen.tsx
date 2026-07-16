import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PosterCard from '../components/PosterCard';
import { useWatchlist } from '../context/WatchlistContext';
import { catalog, type Title } from '../data/catalog';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

export default function MyListScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { ids } = useWatchlist();
  const saved = catalog.filter(t => ids.includes(t.id));

  const openDetails = (title: Title) => navigation.navigate('Details', { titleId: title.id });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Moja lista</Text>
      <FlatList
        data={saved}
        keyExtractor={item => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Twoja lista jest pusta.{'\n'}Dodaj tytuły ze szczegółów filmu.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <PosterCard title={item} onPress={() => openDetails(item)} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  heading: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 16,
  },
  grid: {
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'flex-start',
  },
  gridItem: {
    width: '33%',
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 60,
    lineHeight: 20,
  },
});

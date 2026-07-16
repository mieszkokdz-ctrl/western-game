import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PosterCard from '../components/PosterCard';
import { catalog, type Title } from '../data/catalog';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

export default function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter(
      t => t.title.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
    );
  }, [query]);

  const openDetails = (title: Title) => navigation.navigate('Details', { titleId: title.id });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Szukaj</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Tytuły, kategorie..."
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={<Text style={styles.empty}>Brak wyników</Text>}
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
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
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
    marginTop: 40,
  },
});

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GridThumb from '../components/GridThumb';
import { catalog } from '../data/catalog';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

export default function DiscoverScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter(
      t =>
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Odkrywaj</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Szukaj filmów, autorów, kategorii..."
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={<Text style={styles.empty}>Brak wyników</Text>}
        renderItem={({ item }) => (
          <GridThumb title={item} onPress={() => navigation.navigate('Feed', { initialId: item.id })} />
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
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
  },
});

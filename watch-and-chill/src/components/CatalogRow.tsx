import { FlatList, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import PosterCard from './PosterCard';
import type { Title } from '../data/catalog';

type Props = {
  heading: string;
  titles: Title[];
  onPressTitle: (title: Title) => void;
};

export default function CatalogRow({ heading, titles, onPressTitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{heading}</Text>
      <FlatList
        data={titles}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <PosterCard title={item} onPress={() => onPressTitle(item)} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  heading: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  list: {
    paddingHorizontal: 16,
  },
});

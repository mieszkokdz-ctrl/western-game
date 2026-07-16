import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import type { Title } from '../data/catalog';

type Props = {
  title: Title;
  onPress: () => void;
};

export default function PosterCard({ title, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.75}>
      <Image source={{ uri: title.poster }} style={styles.poster} />
      <Text style={styles.title} numberOfLines={1}>
        {title.title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    marginRight: 12,
  },
  poster: {
    width: 120,
    height: 170,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
  },
  title: {
    color: colors.text,
    fontSize: 12,
    marginTop: 6,
  },
});

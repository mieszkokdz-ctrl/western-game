import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { Title } from '../data/catalog';
import { colors } from '../theme/colors';

type Props = {
  title: Title;
  onPress: () => void;
};

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}tys.`;
  return String(n);
}

export default function GridThumb({ title, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      {title.poster ? (
        <Image source={{ uri: title.poster }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.placeholder]}>
          <Text style={styles.placeholderIcon}>▶</Text>
        </View>
      )}
      <View style={styles.likesBadge}>
        <Text style={styles.likesText}>❤️ {formatCount(title.likes)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '33.3%',
    aspectRatio: 0.72,
    padding: 1.5,
  },
  thumb: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: colors.surfaceAlt,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    color: colors.textMuted,
    fontSize: 24,
  },
  likesBadge: {
    position: 'absolute',
    left: 6,
    bottom: 6,
  },
  likesText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '600',
  },
});

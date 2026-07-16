import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useLikes } from '../context/LikesContext';
import type { Title } from '../data/catalog';
import { colors } from '../theme/colors';

type Props = {
  title: Title;
  active: boolean;
  height: number;
};

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}tys.`;
  return String(n);
}

export default function FeedItem({ title, active, height }: Props) {
  const { isLiked, toggleLike } = useLikes();
  const liked = isLiked(title.id);

  const player = useVideoPlayer(title.videoUrl, p => {
    p.loop = true;
  });

  useEffect(() => {
    if (active) {
      player.play();
    } else {
      player.pause();
    }
  }, [active, player]);

  const togglePlayback = () => {
    if (player.playing) player.pause();
    else player.play();
  };

  return (
    <View style={[styles.container, { height }]}>
      <TouchableWithoutFeedback onPress={togglePlayback}>
        <VideoView player={player} style={StyleSheet.absoluteFill} nativeControls={false} contentFit="cover" />
      </TouchableWithoutFeedback>

      <View style={styles.rightRail} pointerEvents="box-none">
        <TouchableWithoutFeedback onPress={() => toggleLike(title.id)}>
          <View style={styles.railItem}>
            <Text style={[styles.railIcon, liked && { color: colors.primary }]}>{liked ? '❤️' : '🤍'}</Text>
            <Text style={styles.railLabel}>{formatCount(title.likes + (liked ? 1 : 0))}</Text>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.railItem}>
          <Text style={styles.railIcon}>💬</Text>
          <Text style={styles.railLabel}>{formatCount(title.comments)}</Text>
        </View>
        <View style={styles.railItem}>
          <Text style={styles.railIcon}>↗️</Text>
          <Text style={styles.railLabel}>{formatCount(title.shares)}</Text>
        </View>
      </View>

      <View style={styles.bottomInfo} pointerEvents="none">
        <Text style={styles.author}>{title.author}</Text>
        <Text style={styles.caption} numberOfLines={2}>
          {title.caption}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  rightRail: {
    position: 'absolute',
    right: 12,
    bottom: 90,
    alignItems: 'center',
    gap: 22,
  },
  railItem: {
    alignItems: 'center',
  },
  railIcon: {
    fontSize: 30,
  },
  railLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  bottomInfo: {
    paddingHorizontal: 16,
    paddingRight: 80,
    paddingBottom: 24,
  },
  author: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  caption: {
    color: colors.text,
    fontSize: 14,
    marginTop: 6,
    lineHeight: 19,
  },
});

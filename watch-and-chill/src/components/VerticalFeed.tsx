import { useCallback, useRef, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent, ViewToken } from 'react-native';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import FeedItem from './FeedItem';
import type { Title } from '../data/catalog';
import { colors } from '../theme/colors';

type Props = {
  data: Title[];
  height: number;
  initialIndex?: number;
};

export default function VerticalFeed({ data, height, initialIndex = 0 }: Props) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const listRef = useRef<FlatList<Title>>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  // Lower than the previous 70% so the next video is marked active (and
  // starts playing) as soon as it's mostly on screen, rather than waiting
  // for the swipe to almost fully settle — makes transitions feel quicker.
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 40 }).current;

  // On web, mandatory CSS scroll-snap combined with the scaleY(-1) transform
  // `inverted` needs for "swipe down = next video" made touch scrolling
  // barely responsive on a real device. Instead, scrolling here is left
  // completely free (native momentum, no CSS snap) and corrected to the
  // nearest item only once it has fully come to rest — never while
  // anything is still animating, which is what caused an earlier attempt
  // at this to get visually stuck between two videos.
  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (Platform.OS !== 'web' || !listRef.current || height <= 0) return;
      const offsetY = e.nativeEvent.contentOffset.y;
      const targetIndex = Math.max(0, Math.min(data.length - 1, Math.round(offsetY / height)));
      setActiveIndex(targetIndex);
      listRef.current.scrollToIndex({ index: targetIndex, animated: true });
    },
    [data.length, height]
  );

  return (
    <FlatList
      ref={listRef}
      data={data}
      keyExtractor={item => item.id}
      renderItem={({ item, index }) => <FeedItem title={item} active={index === activeIndex} height={height} />}
      // Swiping down reveals the next video.
      inverted
      style={Platform.OS === 'web' ? ({ WebkitOverflowScrolling: 'touch' } as object) : undefined}
      // Native mandatory paging stays on for native apps (no transform
      // conflict there); web relies on handleMomentumScrollEnd instead.
      pagingEnabled={Platform.OS !== 'web'}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      showsVerticalScrollIndicator={false}
      snapToInterval={Platform.OS === 'web' ? undefined : height}
      snapToAlignment="start"
      decelerationRate="fast"
      disableIntervalMomentum
      initialScrollIndex={initialIndex}
      getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      windowSize={3}
      maxToRenderPerBatch={2}
      // react-native-web's clipping measurement is unreliable and can leave
      // off-screen items stuck invisible instead of clipped, so this native-only
      // perf optimization is skipped on web.
      removeClippedSubviews={Platform.OS !== 'web'}
      ListEmptyComponent={
        <View style={[styles.empty, { height }]}>
          <Text style={styles.emptyText}>Brak filmów</Text>
          <Text style={styles.emptySubtext}>Nagraj pierwszy filmik przyciskiem + poniżej</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  emptySubtext: {
    color: colors.textMuted,
    fontSize: 14,
  },
});

import { useCallback, useEffect, useRef, useState } from 'react';
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
  // Mirrors activeIndex so handleScrollEndDrag's snap math always starts
  // from the item that's actually playing. Previously this ref only ever
  // got written from inside handleScrollEndDrag itself, independently of
  // activeIndex (updated separately by onViewableItemsChanged) — the two
  // could drift apart after a partial swipe that crossed the viewability
  // threshold but not the snap threshold, making the next swipe jump from
  // the wrong baseline and effectively go the wrong way.
  const settledIndexRef = useRef(initialIndex);
  useEffect(() => {
    settledIndexRef.current = activeIndex;
  }, [activeIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  // Lower than the previous 70% so the next video is marked active (and
  // starts playing) as soon as it's mostly on screen, rather than waiting
  // for the swipe to almost fully settle — makes transitions feel quicker.
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 40 }).current;

  // On web, CSS scroll-snap (pagingEnabled) only commits to the next video
  // once the drag has covered roughly half of a full-screen-tall item —
  // a much bigger swipe than people expect. This takes over the snap
  // decision in JS with a much lower ~12% threshold instead.
  const handleScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (Platform.OS !== 'web' || !listRef.current || height <= 0) return;
      const offsetY = e.nativeEvent.contentOffset.y;
      const settledOffset = settledIndexRef.current * height;
      const delta = offsetY - settledOffset;
      const threshold = height * 0.12;
      let targetIndex = settledIndexRef.current;
      if (delta > threshold) targetIndex = Math.min(data.length - 1, settledIndexRef.current + 1);
      else if (delta < -threshold) targetIndex = Math.max(0, settledIndexRef.current - 1);
      settledIndexRef.current = targetIndex;
      // Set directly instead of waiting on onViewableItemsChanged to catch
      // up after the animated scrollToIndex below — on a real device the
      // timing of that callback isn't guaranteed, so this is the one
      // authoritative place both the snap target and the active (playing)
      // item get decided together.
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
      // On web, pagingEnabled relies on native CSS scroll-snap for the swipe
      // physics; -webkit-overflow-scrolling makes that momentum feel smooth
      // on iOS/Safari instead of stepping abruptly between videos.
      style={Platform.OS === 'web' ? ({ WebkitOverflowScrolling: 'touch' } as object) : undefined}
      // Swiping up reveals the next video, matching TikTok's convention.
      // On web the snap decision is handled manually in handleScrollEndDrag
      // instead, so the native mandatory-snap magnetism doesn't fight it.
      pagingEnabled={Platform.OS !== 'web'}
      onScrollEndDrag={handleScrollEndDrag}
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

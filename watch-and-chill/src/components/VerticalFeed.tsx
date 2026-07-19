import { useRef, useState } from 'react';
import type { ViewToken } from 'react-native';
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

  return (
    <FlatList
      ref={listRef}
      data={data}
      keyExtractor={item => item.id}
      renderItem={({ item, index }) => <FeedItem title={item} active={index === activeIndex} height={height} />}
      // Swiping down reveals the next video.
      inverted
      style={Platform.OS === 'web' ? ({ WebkitOverflowScrolling: 'touch' } as object) : undefined}
      // Native, browser-guaranteed mandatory paging. This has been tried
      // both ways: with a JS-driven "correct once settled" replacement
      // instead (to dodge a suspected conflict between this and the
      // `inverted` transform), the correction didn't reliably fire on a
      // real device and the list got stuck showing two videos at once —
      // a worse, more confusing bug than swiping needing a fuller gesture.
      // Native mandatory scroll-snap can't get stuck like that; it's kept
      // even if it turns out swiping feels a little heavier as a result.
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={height}
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

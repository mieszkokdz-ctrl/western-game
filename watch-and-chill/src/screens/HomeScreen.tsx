import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VerticalFeed from '../components/VerticalFeed';
import { useVisibleFeed } from '../hooks/useVisibleFeed';
import { colors } from '../theme/colors';

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const windowHeight = Dimensions.get('window').height;
  const itemHeight = windowHeight - tabBarHeight;
  const data = useVisibleFeed();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <VerticalFeed data={data} height={itemHeight} />
      <View style={[styles.header, { top: insets.top + 8 }]} pointerEvents="none">
        <Text style={styles.headerText}>Dla Ciebie</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 4,
  },
});

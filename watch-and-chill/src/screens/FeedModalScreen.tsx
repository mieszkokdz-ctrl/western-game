import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VerticalFeed from '../components/VerticalFeed';
import { useVisibleFeed } from '../hooks/useVisibleFeed';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Route = { key: string; name: 'Feed'; params: RootStackParamList['Feed'] };

export default function FeedModalScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<Route>();
  const windowHeight = Dimensions.get('window').height;

  const data = useVisibleFeed();
  const initialIndex = Math.max(
    0,
    data.findIndex(t => t.id === route.params.initialId)
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <VerticalFeed data={data} height={windowHeight} initialIndex={initialIndex} />
      <SafeAreaView edges={['top']} style={styles.topBar} pointerEvents="box-none">
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: colors.text,
    fontSize: 24,
    marginTop: -2,
  },
});

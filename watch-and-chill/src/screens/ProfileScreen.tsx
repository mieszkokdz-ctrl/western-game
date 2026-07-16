import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GridThumb from '../components/GridThumb';
import { useLikes } from '../context/LikesContext';
import { useUserVideos } from '../context/UserVideosContext';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { ids } = useLikes();
  const { videos } = useUserVideos();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={videos}
        keyExtractor={item => item.id}
        numColumns={3}
        ListHeaderComponent={
          <View>
            <Text style={styles.heading}>Profil</Text>
            <View style={styles.card}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>T</Text>
              </View>
              <View>
                <Text style={styles.name}>@ty</Text>
                <Text style={styles.sub}>
                  {videos.length} shortów · {ids.length} polubionych
                </Text>
              </View>
            </View>
            <Text style={styles.sectionTitle}>Twoje shorty</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Nie nagrałeś(-aś) jeszcze żadnego shorta.{'\n'}Naciśnij „+" na dole ekranu.</Text>
        }
        renderItem={({ item }) => (
          <GridThumb title={item} onPress={() => navigation.navigate('Feed', { initialId: item.id })} />
        )}
        contentContainerStyle={styles.grid}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  grid: {
    paddingHorizontal: 14,
    paddingBottom: 40,
  },
  heading: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  sub: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 20,
  },
});

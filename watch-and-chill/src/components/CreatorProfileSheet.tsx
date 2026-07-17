import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GridThumb from './GridThumb';
import { useVisibleFeed } from '../hooks/useVisibleFeed';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = {
  author: string;
  visible: boolean;
  onClose: () => void;
};

export default function CreatorProfileSheet({ author, visible, onClose }: Props) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const feed = useVisibleFeed();
  const videos = feed.filter(item => item.author === author);

  const openVideo = (id: string) => {
    onClose();
    navigation.navigate('Feed', { initialId: id });
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <FlatList
          data={videos}
          keyExtractor={item => item.id}
          numColumns={3}
          ListHeaderComponent={
            <View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton} testID="creator-profile-close">
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
              <View style={styles.header}>
                <View style={styles.avatarWrap}>
                  <Image source={require('../../assets/icon.png')} style={styles.avatar} />
                </View>
                <Text style={styles.name}>{author}</Text>
              </View>
              <Text style={styles.sectionTitle}>Filmy</Text>
              <View style={styles.divider} />
            </View>
          }
          ListEmptyComponent={<Text style={styles.empty}>Brak filmów</Text>}
          renderItem={({ item }) => <GridThumb title={item} onPress={() => openVideo(item.id)} />}
          contentContainerStyle={styles.grid}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  closeIcon: {
    color: colors.text,
    fontSize: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 20,
  },
  avatarWrap: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: '#FFD60A',
    padding: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 38,
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 10,
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 30,
  },
  grid: {
    paddingHorizontal: 14,
    paddingBottom: 16,
  },
});

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfirmModal from '../components/ConfirmModal';
import GridThumb from '../components/GridThumb';
import { useBlockedUsers } from '../context/BlockedUsersContext';
import { useLikes } from '../context/LikesContext';
import { useUserProfile } from '../context/UserProfileContext';
import { useUserVideos } from '../context/UserVideosContext';
import type { RootStackParamList } from '../navigation/types';
import type { Title } from '../data/catalog';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { ids } = useLikes();
  const { videos, deleteVideo } = useUserVideos();
  const { blockedAuthors, unblockUser } = useBlockedUsers();
  const { username, setUsername } = useUserProfile();
  const [pendingDelete, setPendingDelete] = useState<Title | null>(null);
  const [editVisible, setEditVisible] = useState(false);
  const [draftUsername, setDraftUsername] = useState(username);

  const openEdit = () => {
    setDraftUsername(username);
    setEditVisible(true);
  };

  const saveUsername = () => {
    setUsername(draftUsername);
    setEditVisible(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={videos}
        keyExtractor={item => item.id}
        numColumns={3}
        ListHeaderComponent={
          <View>
            <Text style={styles.heading}>Profil</Text>
            <TouchableOpacity style={styles.card} onPress={openEdit} testID="edit-username-open">
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{username.replace('@', '').charAt(0).toUpperCase() || '?'}</Text>
              </View>
              <View>
                <Text style={styles.name}>{username}</Text>
                <Text style={styles.sub}>
                  {videos.length} shortów · {ids.length} polubionych
                </Text>
                <Text style={styles.editHint}>Dotknij, aby zmienić nazwę</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Twoje shorty</Text>
            {videos.length > 0 && <Text style={styles.hint}>Przytrzymaj short, aby go usunąć.</Text>}
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Nie nagrałeś(-aś) jeszcze żadnego shorta.{'\n'}Naciśnij „+" na dole ekranu.</Text>
        }
        renderItem={({ item }) => (
          <GridThumb
            title={item}
            onPress={() => navigation.navigate('Feed', { initialId: item.id })}
            onLongPress={() => setPendingDelete(item)}
          />
        )}
        contentContainerStyle={styles.grid}
        ListFooterComponent={
          <View style={styles.footer}>
            {blockedAuthors.length > 0 && (
              <View style={styles.blockedSection}>
                <Text style={styles.sectionTitle}>Zablokowani użytkownicy</Text>
                {blockedAuthors.map(author => (
                  <View key={author} style={styles.blockedRow}>
                    <Text style={styles.blockedAuthor}>{author}</Text>
                    <TouchableOpacity onPress={() => unblockUser(author)}>
                      <Text style={styles.unblockText}>Odblokuj</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            <View style={styles.legalRow}>
              <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
                <Text style={styles.legalLink}>Regulamin</Text>
              </TouchableOpacity>
              <Text style={styles.legalDot}>·</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Privacy')}>
                <Text style={styles.legalLink}>Polityka Prywatności</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
      />

      <Modal visible={editVisible} transparent animationType="fade" onRequestClose={() => setEditVisible(false)}>
        <View style={styles.editBackdrop}>
          <View style={styles.editCard}>
            <Text style={styles.editTitle}>Zmień nazwę</Text>
            <TextInput
              value={draftUsername}
              onChangeText={setDraftUsername}
              placeholder="@twojanazwa"
              placeholderTextColor={colors.textMuted}
              style={styles.editInput}
              autoCapitalize="none"
              testID="edit-username-input"
            />
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.editButton} onPress={() => setEditVisible(false)}>
                <Text style={styles.editButtonText}>Anuluj</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={saveUsername} testID="edit-username-save">
                <Text style={[styles.editButtonText, styles.editButtonSave]}>Zapisz</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmModal
        visible={pendingDelete != null}
        title="Usunąć ten short?"
        message="Tej operacji nie można cofnąć."
        confirmLabel="Usuń"
        destructive
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteVideo(pendingDelete.id);
          setPendingDelete(null);
        }}
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
    paddingBottom: 16,
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
  editHint: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  editBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  editCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 20,
  },
  editTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  editInput: {
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  editActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 10,
  },
  editButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
  },
  editButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  editButtonSave: {
    color: colors.primary,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  hint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: -4,
    marginBottom: 8,
  },
  empty: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 30,
    lineHeight: 20,
  },
  footer: {
    marginTop: 24,
    paddingBottom: 40,
  },
  blockedSection: {
    marginBottom: 24,
  },
  blockedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  blockedAuthor: {
    color: colors.text,
    fontSize: 14,
  },
  unblockText: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '700',
  },
  legalRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  legalLink: {
    color: colors.textMuted,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  legalDot: {
    color: colors.textMuted,
    fontSize: 12,
  },
});

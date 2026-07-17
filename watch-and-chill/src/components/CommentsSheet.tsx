import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useComments } from '../context/CommentsContext';
import type { Title } from '../data/catalog';
import { colors } from '../theme/colors';

type Props = {
  title: Title;
  visible: boolean;
  onClose: () => void;
};

export default function CommentsSheet({ title, visible, onClose }: Props) {
  const { getComments, addComment } = useComments();
  const [draft, setDraft] = useState('');
  const comments = getComments(title.id);

  const handleSend = () => {
    if (!draft.trim()) return;
    addComment(title.id, draft);
    setDraft('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTap} activeOpacity={1} onPress={onClose} />
        <SafeAreaView style={styles.sheet} edges={['bottom']}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Komentarze ({comments.length})</Text>
            <TouchableOpacity onPress={onClose} testID="comments-close-button">
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={comments}
            keyExtractor={item => item.id}
            style={styles.list}
            contentContainerStyle={comments.length === 0 && styles.listEmptyContainer}
            renderItem={({ item }) => (
              <View style={styles.commentRow}>
                <Text style={styles.commentAuthor}>{item.author}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Brak komentarzy</Text>
                <Text style={styles.emptySubtext}>Bądź pierwszą osobą, która skomentuje</Text>
              </View>
            }
          />

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.inputBar}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder="Dodaj komentarz..."
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                testID="comment-input"
              />
              <TouchableOpacity onPress={handleSend} disabled={!draft.trim()} testID="comment-send-button">
                <Text style={[styles.sendText, !draft.trim() && styles.sendTextDisabled]}>Wyślij</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-end',
  },
  backdropTap: {
    flex: 1,
  },
  sheet: {
    height: '65%',
    backgroundColor: '#000',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  closeIcon: {
    color: colors.textMuted,
    fontSize: 18,
  },
  list: {
    flex: 1,
  },
  listEmptyContainer: {
    flex: 1,
  },
  commentRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  commentAuthor: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  commentText: {
    color: colors.text,
    fontSize: 14,
    marginTop: 2,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  emptyText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  emptySubtext: {
    color: colors.textMuted,
    fontSize: 13,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    color: colors.text,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
  },
  sendText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  sendTextDisabled: {
    color: colors.textMuted,
  },
});

import { useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

export type LiveChatMessage = {
  id: string;
  author: string;
  text: string;
};

type Props = {
  messages: LiveChatMessage[];
  onSend: (text: string) => void;
};

export default function LiveChatOverlay({ messages, onSend }: Props) {
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList<LiveChatMessage>>(null);

  const handleSend = () => {
    if (!draft.trim()) return;
    onSend(draft.trim());
    setDraft('');
  };

  return (
    <View style={styles.container} pointerEvents="box-none">
      {messages.length > 0 && (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={item => item.id}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={styles.messageRow}>
              <Text style={styles.messageText}>
                <Text style={styles.messageAuthor}>{item.author} </Text>
                {item.text}
              </Text>
            </View>
          )}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />
      )}
      <View style={styles.inputRow}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Napisz komentarz..."
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.input}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          testID="live-chat-input"
        />
        <TouchableOpacity onPress={handleSend} disabled={!draft.trim()} testID="live-chat-send-button">
          <Text style={[styles.sendText, !draft.trim() && styles.sendTextDisabled]}>➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    width: '68%',
    maxWidth: 320,
  },
  list: {
    maxHeight: 180,
    marginBottom: 8,
  },
  messageRow: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 4,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  messageAuthor: {
    color: colors.secondary,
    fontWeight: '700',
    fontSize: 13,
  },
  messageText: {
    color: colors.text,
    fontSize: 13,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 22,
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    paddingVertical: 6,
  },
  sendText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sendTextDisabled: {
    color: 'rgba(255,255,255,0.3)',
  },
});

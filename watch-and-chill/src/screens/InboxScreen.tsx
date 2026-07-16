import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

type Notification = {
  id: string;
  icon: string;
  text: string;
  time: string;
};

const NOTIFICATIONS: Notification[] = [
  { id: '1', icon: '❤️', text: '@wesolykrolik polubił(a) Twój short', time: '2 godz.' },
  { id: '2', icon: '💬', text: '@chillvibes skomentował(a): „Super klimat!"', time: '5 godz.' },
  { id: '3', icon: '👤', text: '@motopasja zaczął(-ęła) Cię obserwować', time: '1 dzień' },
  { id: '4', icon: '↗️', text: '@ekiparajd udostępnił(a) Twój short', time: '2 dni' },
  { id: '5', icon: '❤️', text: '@slowliving i 12 innych osób polubiło Twój short', time: '3 dni' },
];

export default function InboxScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Aktywność</Text>
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.rowText}>
              <Text style={styles.text}>{item.text}</Text>
              <Text style={styles.time}>{item.time} temu</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  heading: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 14,
  },
  icon: {
    fontSize: 22,
  },
  rowText: {
    flex: 1,
  },
  text: {
    color: colors.text,
    fontSize: 14,
  },
  time: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 3,
  },
});

import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWatchlist } from '../context/WatchlistContext';
import { colors } from '../theme/colors';

const MENU = ['Ustawienia konta', 'Preferencje odtwarzania', 'Powiadomienia', 'Pomoc'];

export default function ProfileScreen() {
  const { ids } = useWatchlist();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Profil</Text>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>K</Text>
        </View>
        <View>
          <Text style={styles.name}>Kowboj</Text>
          <Text style={styles.sub}>{ids.length} pozycji na liście</Text>
        </View>
      </View>

      <View style={styles.menu}>
        {MENU.map(item => (
          <View key={item} style={styles.menuItem}>
            <Text style={styles.menuText}>{item}</Text>
          </View>
        ))}
      </View>
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
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
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
  menu: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuText: {
    color: colors.text,
    fontSize: 15,
  },
});

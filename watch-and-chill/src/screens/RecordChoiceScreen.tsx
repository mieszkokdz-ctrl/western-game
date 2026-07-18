import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

export default function RecordChoiceScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()} testID="record-choice-close">
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Chcesz nagrać?</Text>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.replace('LiveBroadcast')}
          testID="choice-live"
        >
          <Text style={styles.optionIcon}>🔴</Text>
          <View style={styles.optionTextWrap}>
            <Text style={styles.optionTitle}>Na żywo</Text>
            <Text style={styles.optionSubtitle}>Transmisja live, którą inni mogą oglądać w czasie rzeczywistym</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => navigation.replace('Create')}
          testID="choice-short"
        >
          <Text style={styles.optionIcon}>🎬</Text>
          <View style={styles.optionTextWrap}>
            <Text style={styles.optionTitle}>Krótki filmik</Text>
            <Text style={styles.optionSubtitle}>Nagraj i opublikuj krótki film (do 60 sekund)</Text>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: colors.text,
    fontSize: 18,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionIcon: {
    fontSize: 32,
  },
  optionTextWrap: {
    flex: 1,
  },
  optionTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  optionSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});

import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useConsent } from '../context/ConsentContext';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

export default function ConsentScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { accept } = useConsent();
  const [checked, setChecked] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.logo}>Watch&Chill</Text>
        <Text style={styles.title}>Zanim zaczniesz</Text>
        <Text style={styles.paragraph}>
          Watch&Chill pozwala oglądać, nagrywać i publikować krótkie filmy. Aby zapewnić bezpieczeństwo wszystkim
          użytkownikom, każdy film można zgłosić, a każdego użytkownika — zablokować. Treści naruszające zasady są
          usuwane.
        </Text>

        <TouchableOpacity
          style={styles.checkboxRow}
          onPress={() => setChecked(v => !v)}
          activeOpacity={0.8}
          testID="consent-checkbox"
        >
          <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
            {checked && <Text style={styles.checkboxMark}>✓</Text>}
          </View>
          <Text style={styles.checkboxLabel}>
            Mam co najmniej 16 lat i akceptuję{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('Terms')}>
              Regulamin
            </Text>{' '}
            oraz{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('Privacy')}>
              Politykę Prywatności
            </Text>
            .
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, !checked && styles.continueButtonDisabled]}
        disabled={!checked}
        testID="consent-continue"
        onPress={async () => {
          await accept();
          navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        }}
      >
        <Text style={styles.continueButtonText}>Kontynuuj</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
    padding: 24,
  },
  content: {
    marginTop: 40,
  },
  logo: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 24,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 14,
  },
  paragraph: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 32,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkboxMark: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  checkboxLabel: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  link: {
    color: colors.secondary,
    fontWeight: '700',
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.4,
  },
  continueButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});

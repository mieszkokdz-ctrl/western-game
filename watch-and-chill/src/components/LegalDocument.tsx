import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { LegalSection } from '../legal/termsContent';
import { colors } from '../theme/colors';

type Props = {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export default function LegalDocument({ title, lastUpdated, sections }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.updated}>Ostatnia aktualizacja: {lastUpdated}</Text>
      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          To jest szablon dokumentu prawnego wygenerowany automatycznie i nie stanowi porady prawnej. Przed
          publikacją aplikacji zaleca się konsultację z prawnikiem oraz uzupełnienie danych oznaczonych jako [w
          nawiasach kwadratowych].
        </Text>
      </View>
      {sections.map(section => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionBody}>{section.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  updated: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  notice: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noticeText: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 17,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionBody: {
    color: colors.textMuted,
    fontSize: 13.5,
    lineHeight: 20,
  },
});

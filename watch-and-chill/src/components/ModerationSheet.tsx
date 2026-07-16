import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ConfirmModal from './ConfirmModal';
import { useBlockedUsers } from '../context/BlockedUsersContext';
import { REPORT_REASONS, useReports, type ReportReason } from '../context/ReportsContext';
import { useUserVideos } from '../context/UserVideosContext';
import type { Title } from '../data/catalog';
import { colors } from '../theme/colors';

type Props = {
  title: Title;
  visible: boolean;
  onClose: () => void;
};

type Step = 'menu' | 'reasons' | 'confirm-block' | 'confirm-delete';

export default function ModerationSheet({ title, visible, onClose }: Props) {
  const [step, setStep] = useState<Step>('menu');
  const { reportVideo } = useReports();
  const { blockUser } = useBlockedUsers();
  const { deleteVideo } = useUserVideos();

  const close = () => {
    setStep('menu');
    onClose();
  };

  const handleReport = (reason: ReportReason) => {
    reportVideo(title.id, reason);
    close();
  };

  return (
    <>
      <Modal
        visible={visible && (step === 'menu' || step === 'reasons')}
        transparent
        animationType="slide"
        onRequestClose={close}
      >
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={close}>
          <TouchableOpacity style={styles.sheet} activeOpacity={1} onPress={() => {}}>
            {step === 'menu' && (
              <>
                {title.isMine ? (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => setStep('confirm-delete')}
                    testID="moderation-delete"
                  >
                    <Text style={[styles.rowText, styles.destructive]}>🗑️  Usuń swój short</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      style={styles.row}
                      onPress={() => setStep('reasons')}
                      testID="moderation-report"
                    >
                      <Text style={styles.rowText}>🚩  Zgłoś</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.row}
                      onPress={() => setStep('confirm-block')}
                      testID="moderation-block"
                    >
                      <Text style={[styles.rowText, styles.destructive]}>🚫  Zablokuj {title.author}</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity style={styles.row} onPress={close}>
                  <Text style={styles.rowText}>Anuluj</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 'reasons' && (
              <>
                <Text style={styles.sheetTitle}>Dlaczego zgłaszasz ten film?</Text>
                {REPORT_REASONS.map((reason, index) => (
                  <TouchableOpacity
                    key={reason}
                    style={styles.row}
                    onPress={() => handleReport(reason)}
                    testID={`report-reason-${index}`}
                  >
                    <Text style={styles.rowText}>{reason}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.row} onPress={() => setStep('menu')}>
                  <Text style={styles.rowText}>Wstecz</Text>
                </TouchableOpacity>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <ConfirmModal
        visible={visible && step === 'confirm-block'}
        title={`Zablokować ${title.author}?`}
        message="Nie będziesz już widzieć filmów tego użytkownika."
        confirmLabel="Zablokuj"
        destructive
        onCancel={() => setStep('menu')}
        onConfirm={() => {
          blockUser(title.author);
          close();
        }}
      />

      <ConfirmModal
        visible={visible && step === 'confirm-delete'}
        title="Usunąć ten short?"
        message="Tej operacji nie można cofnąć."
        confirmLabel="Usuń"
        destructive
        onCancel={() => setStep('menu')}
        onConfirm={() => {
          deleteVideo(title.id);
          close();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingBottom: 28,
  },
  sheetTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  row: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  destructive: {
    color: colors.primary,
  },
});

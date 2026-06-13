import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { PROFILE_COLORS } from './profile-theme';

const DELETE_REASONS = [
  'I am no longer using my account',
  "I don't understand how to use it",
  'ZAPAC is not available in my city',
  'Other',
];

type DeleteAccountModalProps = {
  onCancel: () => void;
  onDelete: (reason: string) => void;
  visible: boolean;
};

export function DeleteAccountModal({ onCancel, onDelete, visible }: DeleteAccountModalProps) {
  const [reason, setReason] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const canDelete = Boolean(reason && confirmed);

  const closeModal = () => {
    Keyboard.dismiss();
    setReason('');
    setConfirmed(false);
    onCancel();
  };

  const deleteAccount = () => {
    if (!canDelete) return;

    onDelete(reason);
    setReason('');
    setConfirmed(false);
  };

  return (
    <Modal animationType="fade" onRequestClose={closeModal} transparent visible={visible}>
      <Pressable onPress={closeModal} style={styles.backdrop}>
        <Pressable onPress={() => undefined} style={styles.card}>
          <View style={styles.decorativeCircle} />
          <View style={styles.header}>
            <View style={styles.warningBadge}>
              <Feather name="alert-triangle" size={23} color={PROFILE_COLORS.red} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Delete Account</Text>
              <Text style={styles.subtitle}>We are sorry to see you go.</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={closeModal}
            >
              <Feather name="x" size={21} color="#8C8C8C" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.prompt}>Please tell us why you are leaving:</Text>

            <View style={styles.reasons}>
              {DELETE_REASONS.map(option => {
                const selected = reason === option;

                return (
                  <TouchableOpacity
                    activeOpacity={0.75}
                    key={option}
                    onPress={() => setReason(option)}
                    style={[styles.reasonRow, selected && styles.selectedReasonRow]}
                  >
                    <View style={[styles.radio, selected && styles.selectedRadio]}>
                      {selected ? <View style={styles.radioDot} /> : null}
                    </View>
                    <Text style={[styles.reasonText, selected && styles.selectedReasonText]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.divider} />

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setConfirmed(current => !current)}
              style={styles.confirmationRow}
            >
              <View style={[styles.checkbox, confirmed && styles.checkedCheckbox]}>
                {confirmed ? <Feather name="check" size={15} color="#FFFFFF" /> : null}
              </View>
              <Text style={styles.confirmationText}>
                I understand that this action is permanent and cannot be undone.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={canDelete ? 0.8 : 1}
              disabled={!canDelete}
              onPress={deleteAccount}
              style={[styles.deleteButton, !canDelete && styles.disabledDeleteButton]}
            >
              <Feather name="trash-2" size={16} color="#FFFFFF" />
              <Text style={styles.deleteButtonText}>Delete Permanently</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} onPress={closeModal} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18, 31, 48, 0.58)',
  },
  card: {
    width: '100%',
    maxWidth: 410,
    maxHeight: '88%',
    padding: 20,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 10,
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    top: -46,
    right: -38,
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: '#FFF1F2',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  warningBadge: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F1',
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: '#2F3237',
    fontSize: 21,
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
    color: '#A08588',
    fontSize: 12,
  },
  content: {
    paddingTop: 22,
  },
  prompt: {
    marginBottom: 12,
    color: '#54575D',
    fontSize: 15,
    fontWeight: '700',
  },
  reasons: {
    gap: 8,
  },
  reasonRow: {
    minHeight: 48,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#EEF0F3',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  selectedReasonRow: {
    borderColor: '#F4B6BA',
    backgroundColor: '#FFF7F7',
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#B7BCC3',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: PROFILE_COLORS.red,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PROFILE_COLORS.red,
  },
  reasonText: {
    flex: 1,
    color: '#5C6066',
    fontSize: 14,
    lineHeight: 19,
  },
  selectedReasonText: {
    color: '#B94E55',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 17,
    backgroundColor: '#ECEDEF',
  },
  confirmationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 11,
  },
  checkbox: {
    width: 21,
    height: 21,
    borderWidth: 2,
    borderColor: '#B7BCC3',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCheckbox: {
    borderColor: PROFILE_COLORS.red,
    backgroundColor: PROFILE_COLORS.red,
  },
  confirmationText: {
    flex: 1,
    color: '#686C73',
    fontSize: 13,
    lineHeight: 18,
  },
  deleteButton: {
    height: 48,
    marginTop: 22,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    backgroundColor: PROFILE_COLORS.red,
  },
  disabledDeleteButton: {
    backgroundColor: '#F8C5C8',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelButton: {
    height: 42,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#767B82',
    fontSize: 14,
    fontWeight: '700',
  },
});

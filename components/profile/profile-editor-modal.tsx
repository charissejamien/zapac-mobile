import { Feather } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import {
  KeyboardAvoidingView,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { PROFILE_COLORS } from './profile-theme';
import { EditableProfileField } from './profile-types';

const GENDER_OPTIONS = ['Female', 'Male', 'Prefer not to say'];
const FIELD_CONTENT = {
  name: {
    icon: 'edit-3' as const,
    title: 'Make it yours',
    description: 'Update the name shown on your commuter profile.',
  },
  gender: {
    icon: 'heart' as const,
    title: 'Choose your vibe',
    description: 'Pick the option that feels right for you.',
  },
  dob: {
    icon: 'calendar' as const,
    title: 'Your special date',
    description: 'Choose your birthday from the calendar.',
  },
};

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return Number.isNaN(date.getTime()) ? new Date(2000, 0, 1) : date;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

type ProfileEditorModalProps = {
  draftValue: string;
  error: string;
  field: EditableProfileField | null;
  onCancel: () => void;
  onChange: (value: string) => void;
  onSave: () => void;
};

export function ProfileEditorModal({
  draftValue,
  error,
  field,
  onCancel,
  onChange,
  onSave,
}: ProfileEditorModalProps) {
  if (!field) return null;

  const content = FIELD_CONTENT[field];

  const closeModal = () => {
    Keyboard.dismiss();
    onCancel();
  };

  const selectDate = (_event: DateTimePickerEvent, date?: Date) => {
    if (date) onChange(formatDate(date));
  };

  return (
    <Modal animationType="fade" onRequestClose={closeModal} transparent visible>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <Pressable onPress={closeModal} style={styles.backdrop}>
          <Pressable onPress={() => undefined} style={styles.card}>
            <View style={styles.decorativeCircle} />
            <View style={styles.header}>
              <LinearGradient colors={['#6E96C9', '#91B6CF']} style={styles.iconBadge}>
                <Feather name={content.icon} size={20} color="#FFFFFF" />
              </LinearGradient>
              <TouchableOpacity
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={closeModal}
              >
                <Feather name="x" size={21} color="#777777" />
              </TouchableOpacity>
            </View>

            <Text style={styles.title}>{content.title}</Text>
            <Text style={styles.description}>{content.description}</Text>

            {field === 'gender' ? (
              <View style={styles.genderOptions}>
                {GENDER_OPTIONS.map(option => (
                  <TouchableOpacity
                    activeOpacity={0.75}
                    key={option}
                    onPress={() => onChange(option)}
                    style={[
                      styles.genderOption,
                      draftValue === option && styles.selectedGenderOption,
                    ]}
                  >
                    <Text
                      style={[
                        styles.genderOptionText,
                        draftValue === option && styles.selectedGenderOptionText,
                      ]}
                    >
                      {option}
                    </Text>
                    {draftValue === option ? (
                      <Feather name="check" size={18} color={PROFILE_COLORS.blue} />
                    ) : null}
                  </TouchableOpacity>
                ))}
              </View>
            ) : field === 'dob' ? (
              <View style={styles.calendarCard}>
                <View style={styles.selectedDate}>
                  <Feather name="calendar" size={16} color={PROFILE_COLORS.blue} />
                  <Text style={styles.selectedDateText}>{draftValue}</Text>
                </View>
                <DateTimePicker
                  display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                  maximumDate={new Date()}
                  mode="date"
                  onChange={selectDate}
                  value={parseDate(draftValue)}
                />
              </View>
            ) : (
              <>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  autoCapitalize="words"
                  autoFocus
                  maxLength={60}
                  onChangeText={onChange}
                  placeholder="Enter your full name"
                  placeholderTextColor="#AAAAAA"
                  style={styles.input}
                  value={draftValue}
                />
              </>
            )}

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.actions}>
              <TouchableOpacity activeOpacity={0.75} onPress={closeModal} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={onSave} style={styles.saveButton}>
                <Feather name="check" size={15} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(18, 31, 48, 0.42)',
  },
  card: {
    width: '100%',
    maxWidth: 390,
    padding: 20,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 8,
    overflow: 'hidden',
  },
  decorativeCircle: {
    position: 'absolute',
    top: -42,
    right: -32,
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: '#EEF6FD',
  },
  header: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: PROFILE_COLORS.text,
    fontSize: 21,
    fontWeight: '700',
  },
  description: {
    marginTop: 4,
    marginBottom: 18,
    color: '#84909E',
    fontSize: 13,
    lineHeight: 18,
  },
  inputLabel: {
    marginBottom: 7,
    color: '#666666',
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    height: 48,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#D9E1EC',
    borderRadius: 9,
    color: PROFILE_COLORS.text,
    fontSize: 15,
    backgroundColor: '#FAFCFF',
  },
  genderOptions: {
    gap: 8,
  },
  genderOption: {
    minHeight: 50,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#E4E8EE',
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedGenderOption: {
    borderColor: '#A9BDD8',
    backgroundColor: '#F1F6FC',
  },
  genderOptionText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedGenderOptionText: {
    color: PROFILE_COLORS.blue,
    fontWeight: '700',
  },
  errorText: {
    marginTop: 8,
    color: PROFILE_COLORS.red,
    fontSize: 12,
  },
  actions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    height: 42,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#DDE3EA',
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#777777',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    height: 42,
    paddingHorizontal: 22,
    borderRadius: 9,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PROFILE_COLORS.blue,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  calendarCard: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#E3ECF5',
    borderRadius: 14,
    backgroundColor: '#FAFCFF',
  },
  selectedDate: {
    height: 38,
    marginBottom: 4,
    paddingHorizontal: 11,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EEF5FC',
  },
  selectedDateText: {
    color: PROFILE_COLORS.blue,
    fontSize: 14,
    fontWeight: '700',
  },
});

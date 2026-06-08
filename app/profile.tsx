import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';

import { DeleteAccountModal } from '@/components/profile/delete-account-modal';
import { ProfileDetailRow } from '@/components/profile/profile-detail-row';
import { ProfileEditorModal } from '@/components/profile/profile-editor-modal';
import { ProfileHeader } from '@/components/profile/profile-header';
import { PROFILE_COLORS } from '@/components/profile/profile-theme';
import { EditableProfileField, ProfileDetails } from '@/components/profile/profile-types';
import { isValidDate } from '@/components/profile/profile-validation';

const INITIAL_PROFILE: ProfileDetails = {
  //TODO: Replace with real data from auth
  name: 'GWAPA',
  gender: 'Female',
  dob: '2004-01-01',
};

export default function ProfileScreen() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [editing, setEditing] = useState<EditableProfileField | null>(null);
  const [draftValue, setDraftValue] = useState('');
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const openEditor = (field: EditableProfileField) => {
    setEditing(field);
    setDraftValue(profile[field]);
    setError('');
  };

  const closeEditor = () => {
    Keyboard.dismiss();
    setEditing(null);
    setError('');
  };

  const updateDraftValue = (value: string) => {
    setDraftValue(value);
    setError('');
  };

  const saveEdit = () => {
    const value = draftValue.trim();

    if (!editing) return;

    if (!value) {
      setError('This field cannot be empty.');
      return;
    }

    if (editing === 'dob' && !isValidDate(value)) {
      setError('Enter a valid date in YYYY-MM-DD format.');
      return;
    }

    setProfile(current => ({ ...current, [editing]: value }));
    closeEditor();
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      {/* TODO: Replace with real email from auth */}
      <ProfileHeader email="cess@gmail.com" name={profile.name} onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>

        <ProfileDetailRow
          icon={<Feather name="user" size={18} color={PROFILE_COLORS.mutedBlue} />}
          label="Full Name"
          value={profile.name}
          onPress={() => openEditor('name')}
        />
        <ProfileDetailRow
          icon={<FontAwesome5 name="venus-mars" size={16} color={PROFILE_COLORS.mutedBlue} />}
          label="Gender"
          value={profile.gender}
          onPress={() => openEditor('gender')}
        />
        <ProfileDetailRow
          icon={<Feather name="calendar" size={17} color={PROFILE_COLORS.mutedBlue} />}
          label="Date of Birth"
          value={profile.dob}
          onPress={() => openEditor('dob')}
        />

        <Text style={[styles.sectionTitle, styles.accountSection]}>ACCOUNT CONTROL</Text>
        <ProfileDetailRow
          destructive
          icon={<Feather name="trash-2" size={17} color={PROFILE_COLORS.red} />}
          label="Delete Account"
          onPress={() => setShowDeleteModal(true)}
        />

        <Text style={styles.securityNote}>Your data is managed securely.</Text>
      </ScrollView>

      <ProfileEditorModal
        draftValue={draftValue}
        error={error}
        field={editing}
        onCancel={closeEditor}
        onChange={updateDraftValue}
        onSave={saveEdit}
      />
      <DeleteAccountModal
        onCancel={() => setShowDeleteModal(false)}
        onDelete={() => setShowDeleteModal(false)}
        visible={showDeleteModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PROFILE_COLORS.background,
  },
  content: {
    paddingHorizontal: 14,
    paddingTop: 20,
    paddingBottom: 36,
  },
  sectionTitle: {
    marginBottom: 8,
    marginLeft: 2,
    color: '#828282',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.25,
  },
  accountSection: {
    marginTop: 22,
  },
  securityNote: {
    marginTop: 20,
    color: '#A0A0A0',
    fontSize: 10,
    textAlign: 'center',
  },
});

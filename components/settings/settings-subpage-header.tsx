import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SETTINGS_COLORS } from './settings-theme';

type SettingsSubpageHeaderProps = {
  onBack: () => void;
  title: string;
};

export function SettingsSubpageHeader({ onBack, title }: SettingsSubpageHeaderProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.header}>
      <View style={styles.toolbar}>
        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          onPress={onBack}
        >
          <Feather name="arrow-left" size={27} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.spacer} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: SETTINGS_COLORS.blue,
  },
  toolbar: {
    height: 74,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '500',
  },
  spacer: {
    width: 27,
  },
});

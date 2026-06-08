import { SettingsSubpageHeader } from '@/components/settings/settings-subpage-header';

type NotificationHeaderProps = {
  onBack: () => void;
};

export function NotificationHeader({ onBack }: NotificationHeaderProps) {
  return <SettingsSubpageHeader onBack={onBack} title="Notifications" />;
}

import RoundedButton from '@/components/RoundedButton';
import { styles } from '@/src/styles/components/top-bar/styles.module';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';

interface HeaderButton {
  text: string;
  color: string;
  fontColor?: string;
  href?: string;
  onPress?: () => Promise<void> | void;
  isLoading?: boolean;
  disabled?: boolean;
}

interface TopBarProps {
  backHref?: string;
  backText?: string;
  title?: string;
  titleColor?: string;
  rightButtons?: HeaderButton[];
  onBackPress?: () => Promise<void> | void;
}

export default function TopBar({
  backHref,
  backText = '< Back',
  title,
  titleColor,
  rightButtons = [],
  onBackPress,
}: TopBarProps) {
  return (
    <View style={styles.header}>
      <View style={styles.backButtonContainer}>
        {backHref || onBackPress ? (
          onBackPress ? (
            <Text style={styles.back} onPress={onBackPress}>
              {backText}
            </Text>
          ) : (
            <Link href={backHref as any}>
              <Text style={styles.back}>{backText}</Text>
            </Link>
          )
        ) : (
          <View style={{ width: 50 }} />
        )}
      </View>
      <Text style={[styles.title, { color: titleColor }]} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
      <View style={styles.rightButtonContainer}>
        {rightButtons.map((btn, idx) =>
          btn.href ? (
            <RoundedButton
              key={idx}
              text={btn.text}
              href={btn.href}
              color={btn.color}
              fontColor={btn.fontColor}
              isSaving={btn.isLoading}
              disabled={btn.disabled}
            />
          ) : (
            <RoundedButton
              key={idx}
              text={btn.text}
              onPress={btn.onPress}
              color={btn.color}
              fontColor={btn.fontColor}
              isSaving={btn.isLoading}
              disabled={btn.disabled}
            />
          )
        )}
      </View>
    </View>
  );
}

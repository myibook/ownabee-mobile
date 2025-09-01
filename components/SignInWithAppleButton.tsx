import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/auth';
import { styles } from '@/src/styles/components/signin-with-apple-button/styles.module';
import { Image, Pressable, Text, View } from 'react-native';

export function SignInWithAppleButton() {
  const { signInWithAppleWebBrowser } = useAuth();

  return (
    <Pressable onPress={signInWithAppleWebBrowser}>
      <View style={styles.container}>
        <Image source={require('../assets/images/apple-icon.png')} style={styles.icon} />
        <Text style={{ color: Colors.white, fontSize: 14, fontWeight: 'bold' }}>
          Continue with Apple
        </Text>
      </View>
    </Pressable>
  );
}

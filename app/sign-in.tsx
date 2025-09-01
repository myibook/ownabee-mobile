// import { SignInWithAppleButton } from '@/components/SignInWithAppleButton';
import SignInWithGoogleButton from '@/components/SignInWithGoogleButton';
import { useAuth } from '@/context/auth';
import { styles } from '@/src/styles/sign-in/styles.module';
import { Image, Text, View } from 'react-native';

export default function LoginForm() {
  const { signIn, isLoading } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.contentContainer}>
          <Image source={require('./../assets/images/logo.png')} />
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.title}>Welcome to OWNABEE!</Text>
        {/* <View style={{ flexDirection: 'row', marginBottom: 30 }}>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={styles.saveText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signUpButton}>
            <Text style={styles.saveText}>Sign up for Free</Text>
          </TouchableOpacity>
        </View> */}
        <View style={styles.buttonContainer}>
          <SignInWithGoogleButton onPress={signIn} disabled={isLoading} />
          {/* <SignInWithAppleButton /> */}
        </View>
      </View>
    </View>
  );
}

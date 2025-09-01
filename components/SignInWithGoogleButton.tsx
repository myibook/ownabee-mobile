import { Colors } from '@/constants/Colors';
import { Image, Pressable, Text, View } from 'react-native';

export default function SignInWithGoogleButton({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <View
        style={{
          width: 250,
          height: 44,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.darkGray,
        }}
      >
        <Image
          source={require('../assets/images/google-icon.png')}
          style={{
            width: 18,
            height: 18,
            marginRight: 6,
          }}
        />
        <Text style={{ fontSize: 14, fontWeight: 'bold' }}>Continue with Google</Text>
      </View>
    </Pressable>
  );
}

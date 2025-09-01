import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  } as ViewStyle,
  disabled: {
    opacity: 0.4,
  } as ViewStyle,
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  } as TextStyle,
  fullWidth: {
    width: '100%',
  } as ViewStyle,
});

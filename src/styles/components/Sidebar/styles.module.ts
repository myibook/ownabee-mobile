import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  sidebarContainer: {
    width: 200,
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginTop: 25,
  },
  sidebarItem: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    minHeight: 80,
    justifyContent: 'center',
  },
  enabledItem: {
    backgroundColor: '#E6FF80FF',
    cursor: 'grab' as any,
  },
  disabledItem: {
    backgroundColor: '#6868685F',
    opacity: 0.6,
  },
  sidebarText: {
    color: 'white',
    fontWeight: '500',
  },
  disabledText: {
    color: '#a0a0a0',
  },
});

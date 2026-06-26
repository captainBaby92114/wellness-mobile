import {StyleSheet} from 'react-native';
import {colors} from '../../../theme';

export const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 24,
  },
  toggleLabel: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
});

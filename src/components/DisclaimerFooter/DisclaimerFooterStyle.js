import {StyleSheet} from 'react-native';
import {colors} from '../../theme';

export const styles = StyleSheet.create({
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.card,
  },
  text: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
});

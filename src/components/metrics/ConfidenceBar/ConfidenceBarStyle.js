import {StyleSheet} from 'react-native';
import {colors} from '../../../theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  confidenceLabel: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 12,
  },
  confidenceValue: {
    color: colors.accent,
    fontWeight: '700',
  },
});

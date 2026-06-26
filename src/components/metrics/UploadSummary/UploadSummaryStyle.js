import {StyleSheet} from 'react-native';
import {colors} from '../../../theme';

export const styles = StyleSheet.create({
  summaryToggle: {
    paddingVertical: 12,
    marginBottom: 8,
  },
  summaryToggleText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  summaryLine: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 8,
  },
});

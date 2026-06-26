import {StyleSheet} from 'react-native';
import {colors} from '../../../theme';

export const styles = StyleSheet.create({
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3A',
  },
  metricRowLast: {
    borderBottomWidth: 0,
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  metricValue: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '700',
  },
});

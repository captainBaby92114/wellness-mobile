import {StyleSheet} from 'react-native';
import {colors} from '../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 16,
  },
  heading: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subheading: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
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
  confidenceLabel: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 12,
  },
  confidenceValue: {
    color: colors.accent,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#2A2A3A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  unavailableCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  unavailableTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  unavailableBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  summaryToggle: {
    paddingVertical: 12,
    marginBottom: 8,
  },
  summaryToggleText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  summaryLine: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  secondaryButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
});

import {StyleSheet} from 'react-native';
import {colors} from '../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: StyleSheet.absoluteFillObject,
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: 220,
    height: 300,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: 'rgba(99, 102, 241, 0.8)',
    backgroundColor: 'transparent',
  },
  recBar: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.danger,
    marginRight: 8,
  },
  recText: {
    color: colors.danger,
    fontWeight: '700',
    marginRight: 12,
  },
  timerText: {
    color: colors.text,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  formatLabel: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    color: colors.textMuted,
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  backButton: {
    padding: 12,
  },
  backButtonText: {
    color: colors.textMuted,
    fontSize: 16,
  },
  recordButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  recordButtonActive: {
    backgroundColor: colors.danger,
  },
  recordButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

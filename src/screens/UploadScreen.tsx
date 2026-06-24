import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import {DataRow} from '../components/DataRow';
import {DisclaimerFooter} from '../components/DisclaimerFooter';
import {uploadVideo, UploadResult} from '../services/uploadService';
import {UPLOAD_URL} from '../config';
import {colors, USER_ID} from '../theme';

interface UploadScreenProps {
  videoUri: string;
  captureTimestamp: string;
  consentTimestamp: string;
  consentVersion: string;
  onSuccess: (result: UploadResult) => void;
  onBack: () => void;
}

export function UploadScreen({
  videoUri,
  captureTimestamp,
  consentTimestamp,
  consentVersion,
  onSuccess,
  onBack,
}: UploadScreenProps) {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deviceModel, setDeviceModel] = useState('');

  useEffect(() => {
    setDeviceModel(DeviceInfo.getModel());
  }, []);

  const startUpload = async () => {
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await uploadVideo({
        videoUri,
        userId: USER_ID,
        consentTimestamp,
        consentVersion,
        captureTimestamp,
        deviceModel,
        onProgress: setProgress,
      });
      onSuccess(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
    }
  };

  useEffect(() => {
    startUpload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Uploading Video</Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, {width: `${progress}%`}]} />
          </View>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        {uploading && (
          <ActivityIndicator
            color={colors.accent}
            size="large"
            style={styles.spinner}
          />
        )}

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={startUpload}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.metadata}>
          <DataRow label="User" value={USER_ID} />
          <DataRow label="Consent timestamp" value={consentTimestamp} />
          <DataRow label="Consent version" value={consentVersion} />
          <DataRow label="Captured at" value={captureTimestamp} />
          <DataRow label="Device" value={deviceModel || 'Loading…'} />
          <DataRow label="Destination" value={UPLOAD_URL} />
        </View>

        {!uploading && !error && (
          <Pressable style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>
        )}
      </View>
      <DisclaimerFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.card,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  progressText: {
    color: colors.text,
    fontSize: 14,
    textAlign: 'center',
    fontVariant: ['tabular-nums'],
  },
  spinner: {
    marginBottom: 24,
  },
  errorBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  metadata: {
    flex: 1,
  },
  backButton: {
    alignItems: 'center',
    padding: 12,
  },
  backButtonText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});

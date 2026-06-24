import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import {DataRow} from '../../components/DataRow/DataRow';
import {DisclaimerFooter} from '../../components/DisclaimerFooter/DisclaimerFooter';
import {uploadVideo} from '../../services/uploadService';
import type {UploadResult} from '../../types';
import {UPLOAD_URL} from '../../config';
import {colors, USER_ID} from '../../theme';
import {styles} from './UploadScreenStyle';

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
  const deviceModel = DeviceInfo.getModel();

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
        deviceModel: DeviceInfo.getModel(),
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
          <DataRow label="Device" value={deviceModel} />
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

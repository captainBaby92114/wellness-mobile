import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import {DisclaimerFooter, ErrorBox, ProgressBar} from '../../components/common';
import {UploadMetaList} from '../../components/upload';
import {uploadVideo} from '../../services/uploadService';
import type {CaptureSource, Metrics, UploadResult} from '../../types';
import {UPLOAD_URL} from '../../config';
import {colors, USER_ID} from '../../theme';
import {styles} from './UploadScreenStyle';

interface UploadScreenProps {
  videoUri: string;
  captureTimestamp: string;
  consentTimestamp: string;
  consentVersion: string;
  source: CaptureSource;
  sdkMetrics: Metrics | null;
  onSuccess: (result: UploadResult) => void;
  onBack: () => void;
}

export function UploadScreen({
  videoUri,
  captureTimestamp,
  consentTimestamp,
  consentVersion,
  source,
  sdkMetrics,
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
        source,
        sdkMetrics,
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
          <ProgressBar percent={progress} />
          <Text style={styles.progressText}>{progress}%</Text>
        </View>

        {uploading && (
          <ActivityIndicator
            color={colors.accent}
            size="large"
            style={styles.spinner}
          />
        )}

        {error && <ErrorBox message={error} onRetry={startUpload} />}

        <UploadMetaList
          userId={USER_ID}
          consentTimestamp={consentTimestamp}
          consentVersion={consentVersion}
          captureTimestamp={captureTimestamp}
          deviceModel={deviceModel}
          destination={UPLOAD_URL}
        />

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

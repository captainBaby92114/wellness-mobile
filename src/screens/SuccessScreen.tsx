import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DataRow} from '../components/DataRow';
import {DisclaimerFooter} from '../components/DisclaimerFooter';
import {UploadResult} from '../services/uploadService';
import {colors} from '../theme';

interface SuccessScreenProps {
  result: UploadResult;
  onScanAgain: () => void;
  onHome: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function SuccessScreen({result, onScanAgain, onHome}: SuccessScreenProps) {
  const savedLocation =
    result.savedTo === 's3'
      ? result.s3Key ?? result.s3Url ?? 'S3'
      : result.savedPath ?? 'Local storage';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Upload Complete</Text>
        <Text style={styles.subtitle}>Your video was uploaded successfully.</Text>

        <DataRow label="Saved to" value={result.savedTo} />
        <DataRow label="Location" value={savedLocation} />
        {result.s3Url && <DataRow label="S3 URL" value={result.s3Url} />}
        <DataRow label="File size" value={formatBytes(result.fileSizeBytes)} />
        <DataRow label="Uploaded at" value={result.uploadedAt} />

        <Text style={styles.sectionTitle}>Metadata</Text>
        {Object.entries(result.metadata).map(([key, value]) => (
          <DataRow key={key} label={key} value={value} />
        ))}

        <Pressable style={styles.primaryButton} onPress={onScanAgain}>
          <Text style={styles.primaryButtonText}>Scan again</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={onHome}>
          <Text style={styles.secondaryButtonText}>Back to home</Text>
        </Pressable>
      </ScrollView>
      <DisclaimerFooter />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    color: colors.success,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    marginBottom: 24,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});

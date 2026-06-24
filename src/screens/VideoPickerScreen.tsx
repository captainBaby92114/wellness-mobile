import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DocumentPicker, {types} from 'react-native-document-picker';
import {DisclaimerFooter} from '../components/DisclaimerFooter';
import {colors, CONSENT_VERSION} from '../theme';

interface VideoPickerScreenProps {
  onUpload: (
    videoUri: string,
    captureTimestamp: string,
    consentTimestamp: string,
    consentVersion: string,
  ) => void;
  onBack: () => void;
}

function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function VideoPickerScreen({onUpload, onBack}: VideoPickerScreenProps) {
  const [filename, setFilename] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);

  const handlePick = async () => {
    try {
      setPicking(true);
      const result = await DocumentPicker.pick({
        type: [types.video],
        allowMultiSelection: false,
      });

      const file = result[0];
      const uri = file.uri;
      const name = file.name ?? 'video.mp4';
      const size = file.size ?? 0;

      setVideoUri(uri);
      setFilename(name);
      setFileSize(size);
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Picker error:', error);
      }
    } finally {
      setPicking(false);
    }
  };

  const handleUpload = () => {
    if (!videoUri) {
      return;
    }
    const now = new Date().toISOString();
    onUpload(videoUri, now, now, CONSENT_VERSION);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Upload Existing Video</Text>
        <Text style={styles.subtitle}>
          Select an .mp4 or .mov file from your device. The original file will
          be uploaded without compression.
        </Text>

        <Pressable style={styles.pickButton} onPress={handlePick} disabled={picking}>
          {picking ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={styles.pickButtonText}>Choose video file</Text>
          )}
        </Pressable>

        {filename && fileSize != null && (
          <View style={styles.fileInfo}>
            <Text style={styles.fileLabel}>Selected file</Text>
            <Text style={styles.fileName}>{filename}</Text>
            <Text style={styles.fileSize}>{formatBytes(fileSize)}</Text>
          </View>
        )}

        <Text style={styles.qualityNote}>
          Original file will be uploaded without compression
        </Text>

        <Pressable
          style={[styles.uploadButton, !videoUri && styles.uploadButtonDisabled]}
          onPress={handleUpload}
          disabled={!videoUri}>
          <Text style={styles.uploadButtonText}>Upload this video</Text>
        </Pressable>

        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
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
    marginBottom: 12,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
  },
  pickButton: {
    backgroundColor: colors.card,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
    marginBottom: 24,
  },
  pickButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
  fileInfo: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  fileLabel: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  fileName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileSize: {
    color: colors.textMuted,
    fontSize: 14,
  },
  qualityNote: {
    color: colors.textMuted,
    fontSize: 13,
    fontStyle: 'italic',
    marginBottom: 24,
  },
  uploadButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  uploadButtonDisabled: {
    opacity: 0.4,
  },
  uploadButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
    padding: 12,
  },
  backButtonText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});

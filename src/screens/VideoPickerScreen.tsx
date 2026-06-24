import React, {useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import RNFS from 'react-native-fs';
import {Asset} from 'react-native-image-picker';
import {DisclaimerFooter} from '../components/DisclaimerFooter';
import {pickVideoFromPhotos} from '../services/photosPickerService';
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

function captureTimestampFromAsset(asset: Asset): string {
  if (asset.timestamp) {
    const parsed = Number(asset.timestamp);
    if (!Number.isNaN(parsed) && parsed > 0) {
      return new Date(parsed).toISOString();
    }
  }
  return new Date().toISOString();
}

async function resolveVideoUri(asset: Asset): Promise<string> {
  const uri = asset.uri;
  if (!uri) {
    throw new Error('No video URI returned from Photos');
  }

  if (Platform.OS === 'android' && uri.startsWith('content://')) {
    const ext = asset.type?.includes('quicktime') ? 'mov' : 'mp4';
    const dest = `${RNFS.CachesDirectoryPath}/photos-pick-${Date.now()}.${ext}`;
    await RNFS.copyFile(uri, dest);
    return `file://${dest}`;
  }

  return uri;
}

export function VideoPickerScreen({onUpload, onBack}: VideoPickerScreenProps) {
  const [filename, setFilename] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [captureTimestamp, setCaptureTimestamp] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePick = async () => {
    try {
      setPicking(true);
      setError(null);

      const result = await pickVideoFromPhotos({
        mediaType: 'video',
        selectionLimit: 1,
        videoQuality: 'high',
      });

      if (result.didCancel) {
        return;
      }

      if (result.errorCode) {
        setError(result.errorMessage ?? 'Could not open Photos');
        return;
      }

      const asset = result.assets?.[0];
      if (!asset?.uri) {
        setError('No video was selected');
        return;
      }

      const uri = await resolveVideoUri(asset);
      const name = asset.fileName ?? 'video.mp4';
      const size = asset.fileSize ?? 0;
      const capturedAt = captureTimestampFromAsset(asset);

      setVideoUri(uri);
      setFilename(name);
      setFileSize(size);
      setCaptureTimestamp(capturedAt);
    } catch (pickError) {
      console.error('Photos picker error:', pickError);
      setError(
        pickError instanceof Error
          ? pickError.message
          : 'Could not load video from Photos',
      );
    } finally {
      setPicking(false);
    }
  };

  const handleUpload = () => {
    if (!videoUri || !captureTimestamp) {
      return;
    }
    const consentTimestamp = new Date().toISOString();
    onUpload(videoUri, captureTimestamp, consentTimestamp, CONSENT_VERSION);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Upload from Photos</Text>
        <Text style={styles.subtitle}>
          Choose a video from your Photos library. The original file will be
          uploaded without compression.
        </Text>

        <Pressable style={styles.pickButton} onPress={handlePick} disabled={picking}>
          {picking ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={styles.pickButtonText}>Choose from Photos</Text>
          )}
        </Pressable>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {filename && fileSize != null && (
          <View style={styles.fileInfo}>
            <Text style={styles.fileLabel}>Selected video</Text>
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

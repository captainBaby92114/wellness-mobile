import React, {useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import {Asset} from 'react-native-image-picker';
import {DisclaimerFooter, ErrorBox} from '../../components/common';
import {SelectedFileInfo} from '../../components/videoPicker';
import {pickVideoFromPhotos} from '../../services/photosPickerService';
import {colors, CONSENT_VERSION} from '../../theme';
import {styles} from './VideoPickerScreenStyle';

interface VideoPickerScreenProps {
  onUpload: (
    videoUri: string,
    captureTimestamp: string,
    consentTimestamp: string,
    consentVersion: string,
  ) => void;
  onBack: () => void;
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
        <Text style={styles.title}>Upload the Video</Text>
        <Text style={styles.subtitle}>
          Choose a video from the library. The original file will be
          uploaded without compression.
        </Text>

        <Pressable style={styles.pickButton} onPress={handlePick} disabled={picking}>
          {picking ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={styles.pickButtonText}>Choose the Video</Text>
          )}
        </Pressable>

        {error && <ErrorBox message={error} />}

        {filename && fileSize != null && (
          <SelectedFileInfo filename={filename} fileSize={fileSize} />
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

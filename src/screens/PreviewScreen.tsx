import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import {DataRow} from '../components/DataRow';
import {colors} from '../theme';
import type {VideoFormatInfo} from './CameraScreen';

interface PreviewScreenProps {
  videoUri: string;
  captureTimestamp: string;
  format?: VideoFormatInfo;
  onRetake: () => void;
  onUseVideo: () => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function PreviewScreen({
  videoUri,
  captureTimestamp,
  format,
  onRetake,
  onUseVideo,
}: PreviewScreenProps) {
  const [duration, setDuration] = useState<number | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFileSize() {
      try {
        const path = videoUri.replace('file://', '');
        const stat = await RNFS.stat(path);
        if (!cancelled) {
          setFileSize(Number(stat.size));
        }
      } catch (error) {
        console.error('Failed to stat video:', error);
      } finally {
        if (!cancelled) {
          setLoadingMeta(false);
        }
      }
    }

    loadFileSize();
    return () => {
      cancelled = true;
    };
  }, [videoUri]);

  const resolution = format
    ? `${format.videoWidth}×${format.videoHeight}`
    : 'Unknown';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Preview Recording</Text>

        <View style={styles.videoContainer}>
          <Video
            source={{uri: videoUri}}
            style={styles.video}
            resizeMode="contain"
            controls
            onLoad={data => setDuration(data.duration)}
          />
        </View>

        {loadingMeta ? (
          <ActivityIndicator color={colors.accent} style={styles.loader} />
        ) : (
          <View style={styles.metadata}>
            <DataRow
              label="Duration"
              value={duration != null ? formatDuration(duration) : 'Loading…'}
            />
            <DataRow label="Resolution" value={resolution} />
            <DataRow
              label="File size"
              value={fileSize != null ? formatBytes(fileSize) : 'Unknown'}
            />
            <DataRow label="Captured at" value={captureTimestamp} />
          </View>
        )}

        <View style={styles.actions}>
          <Pressable style={styles.secondaryButton} onPress={onRetake}>
            <Text style={styles.secondaryButtonText}>Retake</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={onUseVideo}>
            <Text style={styles.primaryButtonText}>Use this video</Text>
          </Pressable>
        </View>
      </View>
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
    padding: 16,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  videoContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    aspectRatio: 9 / 16,
    marginBottom: 16,
  },
  video: {
    flex: 1,
  },
  loader: {
    marginVertical: 16,
  },
  metadata: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.card,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent,
  },
  secondaryButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
});

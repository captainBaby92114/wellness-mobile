import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import {DataRow} from '../../components/DataRow/DataRow';
import {colors} from '../../theme';
import type {VideoFormatInfo} from '../../types';
import {styles} from './PreviewScreenStyle';

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

import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import Video from 'react-native-video';
import {VideoMetaList} from '../../components/preview';
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
      } catch {
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
          <VideoMetaList
            duration={duration}
            fileSize={fileSize}
            resolution={resolution}
            captureTimestamp={captureTimestamp}
          />
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

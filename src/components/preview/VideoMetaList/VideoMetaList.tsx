import React from 'react';
import {View} from 'react-native';
import {DataRow} from '../../common/DataRow/DataRow';
import {formatBytes, formatDuration} from '../../../utils/format';
import {styles} from './VideoMetaListStyle';

interface VideoMetaListProps {
  duration: number | null;
  fileSize: number | null;
  resolution: string;
  captureTimestamp: string;
}

export function VideoMetaList({
  duration,
  fileSize,
  resolution,
  captureTimestamp,
}: VideoMetaListProps) {
  return (
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
  );
}

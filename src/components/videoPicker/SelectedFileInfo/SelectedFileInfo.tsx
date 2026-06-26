import React from 'react';
import {Text, View} from 'react-native';
import {formatBytes} from '../../../utils/format';
import {styles} from './SelectedFileInfoStyle';

interface SelectedFileInfoProps {
  filename: string;
  fileSize: number;
}

export function SelectedFileInfo({filename, fileSize}: SelectedFileInfoProps) {
  return (
    <View style={styles.fileInfo}>
      <Text style={styles.fileLabel}>Selected video</Text>
      <Text style={styles.fileName}>{filename}</Text>
      <Text style={styles.fileSize}>{formatBytes(fileSize)}</Text>
    </View>
  );
}

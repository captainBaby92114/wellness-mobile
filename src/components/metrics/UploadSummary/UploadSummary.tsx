import React, {useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import type {UploadResult} from '../../../types';
import {formatBytes, formatDate} from '../../../utils/format';
import {styles} from './UploadSummaryStyle';

interface UploadSummaryProps {
  uploadResult: UploadResult;
}

export function UploadSummary({uploadResult}: UploadSummaryProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable style={styles.summaryToggle} onPress={() => setOpen(v => !v)}>
        <Text style={styles.summaryToggleText}>
          Upload Summary {open ? '▲' : '▼'}
        </Text>
      </Pressable>

      {open && (
        <View style={styles.card}>
          <Text style={styles.summaryLine}>
            File size: {formatBytes(uploadResult.fileSizeBytes)}
          </Text>
          <Text style={styles.summaryLine}>
            Uploaded: {formatDate(uploadResult.uploadedAt)}
          </Text>
          <Text style={styles.summaryLine}>
            Storage: {uploadResult.savedTo}
          </Text>
          <Text style={styles.summaryLine}>
            User: {uploadResult.metadata.userId}
          </Text>
        </View>
      )}
    </>
  );
}

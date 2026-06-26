import React from 'react';
import {Pressable, Text} from 'react-native';
import {styles} from './ScanActionButtonsStyle';

interface ScanActionButtonsProps {
  cameraAvailable: boolean;
  onRecord: () => void;
  onUploadExisting: () => void;
}

export function ScanActionButtons({
  cameraAvailable,
  onRecord,
  onUploadExisting,
}: ScanActionButtonsProps) {
  return (
    <>
      <Pressable
        style={[
          styles.primaryButton,
          !cameraAvailable && styles.primaryButtonDisabled,
        ]}
        onPress={onRecord}
        disabled={!cameraAvailable}>
        <Text style={styles.primaryButtonText}>
          {cameraAvailable ? 'Record new scan' : 'Camera unavailable'}
        </Text>
      </Pressable>

      {!cameraAvailable && (
        <Text style={styles.hint}>
          No camera detected. You can still upload an existing video.
        </Text>
      )}

      <Pressable style={styles.secondaryButton} onPress={onUploadExisting}>
        <Text style={styles.secondaryButtonText}>Upload the Video</Text>
      </Pressable>
    </>
  );
}

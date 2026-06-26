import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {styles} from './CameraControlsStyle';

interface CameraControlsProps {
  isRecording: boolean;
  onBack: () => void;
  onToggleRecording: () => void;
}

export function CameraControls({
  isRecording,
  onBack,
  onToggleRecording,
}: CameraControlsProps) {
  return (
    <View style={styles.controls}>
      <Pressable style={styles.backButton} onPress={onBack} disabled={isRecording}>
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>

      <Pressable
        style={[styles.recordButton, isRecording && styles.recordButtonActive]}
        onPress={onToggleRecording}>
        <Text style={styles.recordButtonText}>
          {isRecording ? 'Stop' : 'Record'}
        </Text>
      </Pressable>
    </View>
  );
}

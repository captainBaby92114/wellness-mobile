import React from 'react';
import {Text, View} from 'react-native';
import {styles} from './RecordingIndicatorStyle';

interface RecordingIndicatorProps {
  elapsedSeconds: number;
}

export function RecordingIndicator({elapsedSeconds}: RecordingIndicatorProps) {
  const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
  const seconds = String(elapsedSeconds % 60).padStart(2, '0');

  return (
    <View style={styles.recBar}>
      <View style={styles.recDot} />
      <Text style={styles.recText}>REC</Text>
      <Text style={styles.timerText}>
        {minutes}:{seconds}
      </Text>
    </View>
  );
}

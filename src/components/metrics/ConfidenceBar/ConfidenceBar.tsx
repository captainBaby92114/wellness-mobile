import React from 'react';
import {Text, View} from 'react-native';
import {ProgressBar} from '../../common/ProgressBar/ProgressBar';
import {styles} from './ConfidenceBarStyle';

interface ConfidenceBarProps {
  confidence: number | null;
}

export function ConfidenceBar({confidence}: ConfidenceBarProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.confidenceLabel}>
        Scan Confidence{' '}
        <Text style={styles.confidenceValue}>
          {confidence != null ? `${confidence}%` : '--'}
        </Text>
      </Text>
      <ProgressBar percent={confidence ?? 0} trackColor="#2A2A3A" />
    </View>
  );
}

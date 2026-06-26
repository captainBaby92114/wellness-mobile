import React from 'react';
import {View} from 'react-native';
import {colors} from '../../../theme';
import {styles} from './ProgressBarStyle';

interface ProgressBarProps {
  percent: number;
  trackColor?: string;
}

export function ProgressBar({percent, trackColor = colors.card}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <View style={[styles.track, {backgroundColor: trackColor}]}>
      <View style={[styles.fill, {width: `${clamped}%`}]} />
    </View>
  );
}

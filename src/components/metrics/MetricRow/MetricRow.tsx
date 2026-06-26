import React from 'react';
import {Text, View} from 'react-native';
import {styles} from './MetricRowStyle';

interface MetricRowProps {
  icon: string;
  label: string;
  value: string;
  isLast?: boolean;
}

export function MetricRow({icon, label, value, isLast}: MetricRowProps) {
  return (
    <View style={[styles.metricRow, isLast && styles.metricRowLast]}>
      <Text style={styles.metricLabel}>
        {icon}  {label}
      </Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

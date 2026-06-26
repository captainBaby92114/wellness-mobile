import React from 'react';
import {View} from 'react-native';
import type {Metrics} from '../../../types';
import {formatMetricValue} from '../../../utils/format';
import {MetricRow} from '../MetricRow/MetricRow';
import {styles} from './MetricsCardStyle';

interface MetricsCardProps {
  metrics: Metrics;
}

export function MetricsCard({metrics}: MetricsCardProps) {
  return (
    <View style={styles.card}>
      <MetricRow
        icon="❤️"
        label="Heart Rate"
        value={formatMetricValue(metrics.heartRate, 'BPM')}
      />
      <MetricRow
        icon="〰️"
        label="HRV"
        value={formatMetricValue(metrics.hrv, 'ms')}
      />
      <MetricRow
        icon="🫁"
        label="Resp. Rate"
        value={formatMetricValue(metrics.respiratoryRate, '/min')}
      />
      <MetricRow
        icon="🩸"
        label="SpO2"
        value={formatMetricValue(metrics.spo2, '%')}
      />
      <MetricRow
        icon="📈"
        label="Sys. BP"
        value={formatMetricValue(metrics.systolicBp, 'mmHg')}
      />
      <MetricRow
        icon="📉"
        label="Dia. BP"
        value={formatMetricValue(metrics.diastolicBp, 'mmHg')}
        isLast
      />
    </View>
  );
}

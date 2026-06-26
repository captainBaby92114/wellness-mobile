import React from 'react';
import {Text, View} from 'react-native';
import {styles} from './MetricsUnavailableStyle';

export function MetricsUnavailable() {
  return (
    <View style={styles.unavailableCard}>
      <Text style={styles.unavailableTitle}>⚠️  Can't fetch metrics</Text>
      <Text style={styles.unavailableBody}>
        Your video was saved, but neither Shen.AI nor Circadify could return
        wellness metrics for this scan.
      </Text>
    </View>
  );
}

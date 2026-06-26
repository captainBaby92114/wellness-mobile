import React from 'react';
import {Pressable, ScrollView, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DisclaimerFooter} from '../../components/common';
import {
  ConfidenceBar,
  MetricsCard,
  MetricsUnavailable,
  UploadSummary,
} from '../../components/metrics';
import type {Metrics, UploadResult} from '../../types';
import {formatDate} from '../../utils/format';
import {styles} from './MetricsScreenStyle';

interface MetricsScreenProps {
  metrics: Metrics | null;
  uploadResult: UploadResult;
  onScanAgain: () => void;
  onDone: () => void;
}

export function MetricsScreen({
  metrics,
  uploadResult,
  onScanAgain,
  onDone,
}: MetricsScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Wellness Scan Results</Text>
        <Text style={styles.subheading}>
          Captured: {formatDate(uploadResult.uploadedAt)}
        </Text>

        {metrics ? (
          <>
            <MetricsCard metrics={metrics} />
            <ConfidenceBar confidence={metrics.confidence} />
          </>
        ) : (
          <MetricsUnavailable />
        )}

        <UploadSummary uploadResult={uploadResult} />

        <Pressable style={styles.primaryButton} onPress={onScanAgain}>
          <Text style={styles.primaryButtonText}>Scan Again</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={onDone}>
          <Text style={styles.secondaryButtonText}>Done</Text>
        </Pressable>
      </ScrollView>
      <DisclaimerFooter />
    </SafeAreaView>
  );
}

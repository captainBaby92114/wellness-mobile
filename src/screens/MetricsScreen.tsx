import React, {useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DisclaimerFooter} from '../components/DisclaimerFooter';
import {colors} from '../theme';
import type {Metrics, UploadResult} from '../types';

interface MetricsScreenProps {
  metrics: Metrics | null;
  uploadResult: UploadResult;
  onScanAgain: () => void;
  onDone: () => void;
}

function formatMetricValue(value: number | null, unit: string): string {
  if (value == null) {
    return '--';
  }
  return `${value} ${unit}`;
}

function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

function MetricRow({
  icon,
  label,
  value,
  isLast,
}: {
  icon: string;
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.metricRow, isLast && styles.metricRowLast]}>
      <Text style={styles.metricLabel}>
        {icon}  {label}
      </Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export function MetricsScreen({
  metrics,
  uploadResult,
  onScanAgain,
  onDone,
}: MetricsScreenProps) {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const confidence = metrics?.confidence ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Wellness Scan Results</Text>
        <Text style={styles.subheading}>
          Captured: {formatDate(uploadResult.uploadedAt)}
        </Text>

        {metrics ? (
          <>
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

            <View style={styles.card}>
              <Text style={styles.confidenceLabel}>
                Scan Confidence{' '}
                <Text style={styles.confidenceValue}>
                  {metrics.confidence != null
                    ? `${metrics.confidence}%`
                    : '--'}
                </Text>
              </Text>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, {width: `${confidence}%`}]}
                />
              </View>
            </View>
          </>
        ) : (
          <View style={styles.unavailableCard}>
            <Text style={styles.unavailableTitle}>
              ⚠️  Metrics unavailable
            </Text>
            <Text style={styles.unavailableBody}>
              The scan could not be processed. Your video was saved
              successfully.
            </Text>
          </View>
        )}

        <Pressable
          style={styles.summaryToggle}
          onPress={() => setSummaryOpen(open => !open)}>
          <Text style={styles.summaryToggleText}>
            Upload Summary {summaryOpen ? '▲' : '▼'}
          </Text>
        </Pressable>

        {summaryOpen && (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 16,
  },
  heading: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subheading: {
    color: '#6B7280',
    fontSize: 14,
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3A',
  },
  metricRowLast: {
    borderBottomWidth: 0,
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 14,
  },
  metricValue: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: '700',
  },
  confidenceLabel: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 12,
  },
  confidenceValue: {
    color: colors.accent,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#2A2A3A',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 4,
  },
  unavailableCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  unavailableTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  unavailableBody: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  summaryToggle: {
    paddingVertical: 12,
    marginBottom: 8,
  },
  summaryToggleText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  summaryLine: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  secondaryButtonText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '600',
  },
});

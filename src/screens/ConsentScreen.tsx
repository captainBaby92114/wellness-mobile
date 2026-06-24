import React, {useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import {DisclaimerFooter} from '../components/DisclaimerFooter';
import {colors, CONSENT_VERSION} from '../theme';

interface ConsentScreenProps {
  onAgree: (consentTimestamp: string, consentVersion: string) => void;
  onBack: () => void;
}

export function ConsentScreen({onAgree, onBack}: ConsentScreenProps) {
  const [optedIn, setOptedIn] = useState(false);

  const handleStart = () => {
    if (!optedIn) {
      return;
    }
    const consentTimestamp = new Date().toISOString();
    console.log('Consent granted:', {consentTimestamp, consentVersion: CONSENT_VERSION});
    onAgree(consentTimestamp, CONSENT_VERSION);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Recording Consent</Text>
        <Text style={styles.body}>
          Your wellness scan will be recorded as a video and uploaded to our
          servers for processing. The video is stored securely and used only for
          informational wellness insights.
        </Text>
        <Text style={styles.body}>
          By enabling the toggle below, you explicitly consent to video recording
          and upload.
        </Text>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>I consent to recording and upload</Text>
          <Switch
            value={optedIn}
            onValueChange={setOptedIn}
            trackColor={{false: colors.card, true: colors.accent}}
            thumbColor={colors.text}
          />
        </View>

        <Pressable
          style={[styles.button, !optedIn && styles.buttonDisabled]}
          onPress={handleStart}
          disabled={!optedIn}>
          <Text style={styles.buttonText}>Start scan</Text>
        </Pressable>

        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
      </View>
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
    flex: 1,
    padding: 24,
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  body: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 24,
  },
  toggleLabel: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
    marginRight: 12,
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 16,
    alignItems: 'center',
    padding: 12,
  },
  backButtonText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});

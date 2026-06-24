import React, {useState} from 'react';
import {Pressable, Switch, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DisclaimerFooter} from '../components/DisclaimerFooter';
import {colors, CONSENT_VERSION} from '../theme';
import {styles} from './ConsentScreenStyle';

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

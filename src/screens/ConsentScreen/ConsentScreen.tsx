import React, {useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DisclaimerFooter} from '../../components/common';
import {ConsentToggle} from '../../components/consent';
import {CONSENT_VERSION} from '../../theme';
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

        <ConsentToggle value={optedIn} onValueChange={setOptedIn} />

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

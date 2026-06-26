import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {styles} from './ErrorBoxStyle';

interface ErrorBoxProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorBox({message, onRetry, retryLabel = 'Retry'}: ErrorBoxProps) {
  return (
    <View style={styles.errorBox}>
      <Text style={[styles.errorText, onRetry && styles.errorTextSpaced]}>
        {message}
      </Text>
      {onRetry && (
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>{retryLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

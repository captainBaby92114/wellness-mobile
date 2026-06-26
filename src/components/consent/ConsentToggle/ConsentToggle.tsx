import React from 'react';
import {Switch, Text, View} from 'react-native';
import {colors} from '../../../theme';
import {styles} from './ConsentToggleStyle';

interface ConsentToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export function ConsentToggle({value, onValueChange}: ConsentToggleProps) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>I consent to recording and upload</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{false: colors.card, true: colors.accent}}
        thumbColor={colors.text}
      />
    </View>
  );
}

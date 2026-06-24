import React from 'react';
import {Text, View} from 'react-native';
import {styles} from './DataRowStyle';

interface DataRowProps {
  label: string;
  value: string;
}

export function DataRow({label, value}: DataRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

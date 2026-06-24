import React from 'react';
import {Text, View} from 'react-native';
import {styles} from './DisclaimerFooterStyle';

export function DisclaimerFooter() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>
        For informational purposes only. Not medical advice.
      </Text>
    </View>
  );
}

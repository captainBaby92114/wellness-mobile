import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme';

export function DisclaimerFooter() {
  return (
    <View style={styles.footer}>
      <Text style={styles.text}>
        For informational purposes only. Not medical advice.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.card,
  },
  text: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
});

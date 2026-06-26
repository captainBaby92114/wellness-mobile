import React from 'react';
import {View} from 'react-native';
import {styles} from './CameraOverlayStyle';

export function CameraOverlay() {
  return (
    <View style={styles.overlay}>
      <View style={styles.faceGuide} />
    </View>
  );
}

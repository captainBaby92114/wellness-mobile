import React from 'react';
import {Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DisclaimerFooter} from '../../components/common';
import {ScanActionButtons} from '../../components/home';
import {useCameraAvailable} from '../../hooks/useCameraAvailable';
import {styles} from './HomeScreenStyle';

interface HomeScreenProps {
  onRecord: () => void;
  onUploadExisting: () => void;
}

export function HomeScreen({onRecord, onUploadExisting}: HomeScreenProps) {
  const {available: cameraAvailable} = useCameraAvailable();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Wellness Scan</Text>
        <Text style={styles.subtitle}>
          Record a new scan or upload an existing video from the library.
        </Text>

        <ScanActionButtons
          cameraAvailable={cameraAvailable}
          onRecord={onRecord}
          onUploadExisting={onUploadExisting}
        />
      </View>
      <DisclaimerFooter />
    </SafeAreaView>
  );
}

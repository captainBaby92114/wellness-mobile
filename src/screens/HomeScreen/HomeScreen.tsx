import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {DisclaimerFooter} from '../../components/DisclaimerFooter/DisclaimerFooter';
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

        <Pressable
          style={[
            styles.primaryButton,
            !cameraAvailable && styles.primaryButtonDisabled,
          ]}
          onPress={onRecord}
          disabled={!cameraAvailable}>
          <Text style={styles.primaryButtonText}>
            {cameraAvailable ? 'Record new scan' : 'Camera unavailable'}
          </Text>
        </Pressable>

        {!cameraAvailable && (
          <Text style={styles.hint}>
            No camera detected. You can still upload an existing video.
          </Text>
        )}

        <Pressable style={styles.secondaryButton} onPress={onUploadExisting}>
          <Text style={styles.secondaryButtonText}>Upload the Video</Text>
        </Pressable>
      </View>
      <DisclaimerFooter />
    </SafeAreaView>
  );
}

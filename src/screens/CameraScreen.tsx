import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import {colors} from '../theme';

const MAX_RECORD_SECONDS = 30;

export interface VideoFormatInfo {
  videoWidth: number;
  videoHeight: number;
  maxFps: number;
}

interface CameraScreenProps {
  onComplete: (videoUri: string, captureTimestamp: string, format: VideoFormatInfo) => void;
  onBack: () => void;
}

export function CameraScreen({onComplete, onBack}: CameraScreenProps) {
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('front');
  const {hasPermission: hasCameraPermission, requestPermission: requestCamera} =
    useCameraPermission();
  const {hasPermission: hasMicPermission, requestPermission: requestMic} =
    useMicrophonePermission();

  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const format = useMemo(() => {
    const formats = device?.formats ?? [];
    const eligible = formats
      .filter(f => f.videoWidth >= 1920)
      .sort((a, b) => {
        const resA = a.videoWidth * a.videoHeight;
        const resB = b.videoWidth * b.videoHeight;
        if (resB !== resA) {
          return resB - resA;
        }
        return b.maxFps - a.maxFps;
      });
    return eligible[0] ?? formats[0];
  }, [device?.formats]);

  const formatInfo: VideoFormatInfo | undefined = format
    ? {
        videoWidth: format.videoWidth,
        videoHeight: format.videoHeight,
        maxFps: format.maxFps,
      }
    : undefined;

  useEffect(() => {
    requestCamera();
    requestMic();
  }, [requestCamera, requestMic]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!cameraRef.current || !isRecording) {
      return;
    }
    stopTimer();
    setIsRecording(false);
    await cameraRef.current.stopRecording();
  }, [isRecording, stopTimer]);

  const startRecording = useCallback(async () => {
    if (!cameraRef.current || isRecording) {
      return;
    }

    const captureTimestamp = new Date().toISOString();
    setIsRecording(true);
    setElapsedSeconds(0);

    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => {
        const next = prev + 1;
        if (next >= MAX_RECORD_SECONDS) {
          stopRecording();
        }
        return next;
      });
    }, 1000);

    cameraRef.current.startRecording({
      fileType: 'mp4',
      videoCodec: 'h264',
      onRecordingFinished: video => {
        stopTimer();
        setIsRecording(false);
        const uri = video.path.startsWith('file://')
          ? video.path
          : `file://${video.path}`;
        onComplete(uri, captureTimestamp, formatInfo ?? {
          videoWidth: format.videoWidth,
          videoHeight: format.videoHeight,
          maxFps: format.maxFps,
        });
      },
      onRecordingError: error => {
        stopTimer();
        setIsRecording(false);
        console.error('Recording error:', error);
      },
    });
  }, [formatInfo, isRecording, onComplete, stopRecording, stopTimer]);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  if (!hasCameraPermission || !hasMicPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.message}>Camera and microphone access required.</Text>
          <Pressable style={styles.button} onPress={() => { requestCamera(); requestMic(); }}>
            <Text style={styles.buttonText}>Grant permissions</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (!device || !format) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} size="large" />
          <Text style={styles.message}>Loading front camera…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const formatLabel = `${format.videoWidth}×${format.videoHeight} @ ${format.maxFps}fps`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          video={true}
          audio={true}
          format={format}
          fps={format.maxFps}
          videoBitRate="high"
          videoStabilizationMode="standard"
        />

        <View style={styles.overlay}>
          <View style={styles.faceGuide} />
        </View>

        {isRecording && (
          <View style={styles.recBar}>
            <View style={styles.recDot} />
            <Text style={styles.recText}>REC</Text>
            <Text style={styles.timerText}>
              {String(Math.floor(elapsedSeconds / 60)).padStart(2, '0')}:
              {String(elapsedSeconds % 60).padStart(2, '0')}
            </Text>
          </View>
        )}

        <Text style={styles.formatLabel}>{formatLabel}</Text>
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.backButton} onPress={onBack} disabled={isRecording}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        <Pressable
          style={[styles.recordButton, isRecording && styles.recordButtonActive]}
          onPress={isRecording ? stopRecording : startRecording}>
          <Text style={styles.recordButtonText}>
            {isRecording ? 'Stop' : 'Record'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: 220,
    height: 300,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: 'rgba(99, 102, 241, 0.8)',
    backgroundColor: 'transparent',
  },
  recBar: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.danger,
    marginRight: 8,
  },
  recText: {
    color: colors.danger,
    fontWeight: '700',
    marginRight: 12,
  },
  timerText: {
    color: colors.text,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  formatLabel: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    color: colors.textMuted,
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
  },
  backButton: {
    padding: 12,
  },
  backButtonText: {
    color: colors.textMuted,
    fontSize: 16,
  },
  recordButton: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  recordButtonActive: {
    backgroundColor: colors.danger,
  },
  recordButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

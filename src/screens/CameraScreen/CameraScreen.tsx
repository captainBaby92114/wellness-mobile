import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ActivityIndicator, Pressable, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
} from 'react-native-vision-camera';
import {
  CameraControls,
  CameraOverlay,
  RecordingIndicator,
} from '../../components/camera';
import {colors} from '../../theme';
import {getShenAiMetrics} from '../../services/shenaiService';
import type {Metrics, VideoFormatInfo} from '../../types';
import {styles} from './CameraScreenStyle';

const MAX_RECORD_SECONDS = 30;

export type {VideoFormatInfo};

interface CameraScreenProps {
  onComplete: (
    videoUri: string,
    captureTimestamp: string,
    format: VideoFormatInfo,
    sdkMetrics: Metrics | null,
  ) => void;
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

  const formatInfo = useMemo<VideoFormatInfo | undefined>(() => {
    if (!format) {
      return undefined;
    }
    return {
      videoWidth: format.videoWidth,
      videoHeight: format.videoHeight,
      maxFps: format.maxFps,
    };
  }, [format]);

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
    if (!cameraRef.current || isRecording || !formatInfo) {
      return;
    }

    const captureTimestamp = new Date().toISOString();
    setIsRecording(true);
    setElapsedSeconds(0);

    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    cameraRef.current.startRecording({
      fileType: 'mp4',
      videoCodec: 'h264',
      onRecordingFinished: async video => {
        stopTimer();
        setIsRecording(false);
        const uri = video.path.startsWith('file://')
          ? video.path
          : `file://${video.path}`;
        const sdkMetrics = await getShenAiMetrics();
        onComplete(uri, captureTimestamp, formatInfo, sdkMetrics);
      },
      onRecordingError: () => {
        stopTimer();
        setIsRecording(false);
      },
    });
  }, [formatInfo, isRecording, onComplete, stopTimer]);

  useEffect(() => {
    if (isRecording && elapsedSeconds >= MAX_RECORD_SECONDS) {
      stopRecording();
    }
  }, [isRecording, elapsedSeconds, stopRecording]);

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
          style={styles.camera}
          device={device}
          isActive={true}
          video={true}
          audio={true}
          format={format}
          fps={format.maxFps}
          videoBitRate="high"
          videoStabilizationMode="standard"
        />

        <CameraOverlay />

        {isRecording && <RecordingIndicator elapsedSeconds={elapsedSeconds} />}

        <Text style={styles.formatLabel}>{formatLabel}</Text>
      </View>

      <CameraControls
        isRecording={isRecording}
        onBack={onBack}
        onToggleRecording={isRecording ? stopRecording : startRecording}
      />
    </SafeAreaView>
  );
}

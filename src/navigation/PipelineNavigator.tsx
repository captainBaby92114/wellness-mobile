import React, {useState} from 'react';
import {HomeScreen} from '../screens/HomeScreen/HomeScreen';
import {ConsentScreen} from '../screens/ConsentScreen/ConsentScreen';
import {CameraScreen} from '../screens/CameraScreen/CameraScreen';
import {PreviewScreen} from '../screens/PreviewScreen/PreviewScreen';
import {VideoPickerScreen} from '../screens/VideoPickerScreen/VideoPickerScreen';
import {UploadScreen} from '../screens/UploadScreen/UploadScreen';
import {MetricsScreen} from '../screens/MetricsScreen/MetricsScreen';
import type {Screen, UploadResult, VideoFormatInfo} from '../types';

type Flow = 'record' | 'upload' | null;

export function PipelineNavigator() {
  const [screen, setScreen] = useState<Screen>('home');
  const [flow, setFlow] = useState<Flow>(null);

  const [consentTimestamp, setConsentTimestamp] = useState('');
  const [consentVersion, setConsentVersion] = useState('');
  const [videoUri, setVideoUri] = useState('');
  const [captureTimestamp, setCaptureTimestamp] = useState('');
  const [format, setFormat] = useState<VideoFormatInfo | undefined>();
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const resetSession = () => {
    setConsentTimestamp('');
    setConsentVersion('');
    setVideoUri('');
    setCaptureTimestamp('');
    setFormat(undefined);
    setUploadResult(null);
  };

  const goHome = () => {
    resetSession();
    setFlow(null);
    setScreen('home');
  };

  const startRecordFlow = () => {
    resetSession();
    setFlow('record');
    setScreen('consent');
  };

  const startUploadFlow = () => {
    resetSession();
    setFlow('upload');
    setScreen('picker');
  };

  const handleConsent = (timestamp: string, version: string) => {
    setConsentTimestamp(timestamp);
    setConsentVersion(version);
    setScreen('camera');
  };

  const handleRecordingComplete = (
    uri: string,
    timestamp: string,
    fmt: VideoFormatInfo,
  ) => {
    setVideoUri(uri);
    setCaptureTimestamp(timestamp);
    setFormat(fmt);
    setScreen('preview');
  };

  const handleRetake = () => {
    setVideoUri('');
    setCaptureTimestamp('');
    setFormat(undefined);
    setScreen('camera');
  };

  const handleUseVideo = () => {
    setScreen('upload');
  };

  const handlePickerUpload = (
    uri: string,
    captureTs: string,
    consentTs: string,
    consentVer: string,
  ) => {
    setVideoUri(uri);
    setCaptureTimestamp(captureTs);
    setConsentTimestamp(consentTs);
    setConsentVersion(consentVer);
    setFormat(undefined);
    setScreen('upload');
  };

  const handleUploadSuccess = (result: UploadResult) => {
    setUploadResult(result);
    setScreen('metrics');
  };

  switch (screen) {
    case 'home':
      return (
        <HomeScreen
          onRecord={startRecordFlow}
          onUploadExisting={startUploadFlow}
        />
      );

    case 'consent':
      return (
        <ConsentScreen
          onAgree={handleConsent}
          onBack={goHome}
        />
      );

    case 'camera':
      return (
        <CameraScreen
          onComplete={handleRecordingComplete}
          onBack={() => {
            if (flow === 'record' && consentTimestamp) {
              setScreen('consent');
            } else {
              goHome();
            }
          }}
        />
      );

    case 'preview':
      return (
        <PreviewScreen
          videoUri={videoUri}
          captureTimestamp={captureTimestamp}
          format={format}
          onRetake={handleRetake}
          onUseVideo={handleUseVideo}
        />
      );

    case 'picker':
      return (
        <VideoPickerScreen
          onUpload={handlePickerUpload}
          onBack={goHome}
        />
      );

    case 'upload':
      return (
        <UploadScreen
          videoUri={videoUri}
          captureTimestamp={captureTimestamp}
          consentTimestamp={consentTimestamp}
          consentVersion={consentVersion}
          onSuccess={handleUploadSuccess}
          onBack={() => {
            if (flow === 'record') {
              setScreen('preview');
            } else {
              setScreen('picker');
            }
          }}
        />
      );

    case 'metrics':
      return uploadResult ? (
        <MetricsScreen
          metrics={uploadResult.metrics}
          uploadResult={uploadResult}
          onScanAgain={goHome}
          onDone={goHome}
        />
      ) : null;

    default:
      return null;
  }
}

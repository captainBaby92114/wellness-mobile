import React, {useState} from 'react';
import {HomeScreen} from '../screens/HomeScreen';
import {ConsentScreen} from '../screens/ConsentScreen';
import {CameraScreen, VideoFormatInfo} from '../screens/CameraScreen';
import {PreviewScreen} from '../screens/PreviewScreen';
import {VideoPickerScreen} from '../screens/VideoPickerScreen';
import {UploadScreen} from '../screens/UploadScreen';
import {SuccessScreen} from '../screens/SuccessScreen';
import {UploadResult} from '../services/uploadService';

type Screen =
  | 'home'
  | 'consent'
  | 'camera'
  | 'preview'
  | 'picker'
  | 'upload'
  | 'success';

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

  const goHome = () => {
    setScreen('home');
    setFlow(null);
    setVideoUri('');
    setCaptureTimestamp('');
    setFormat(undefined);
    setUploadResult(null);
  };

  const startRecordFlow = () => {
    setFlow('record');
    setScreen('consent');
  };

  const startUploadFlow = () => {
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
    setScreen('success');
  };

  const handleScanAgain = () => {
    setVideoUri('');
    setCaptureTimestamp('');
    setFormat(undefined);
    setUploadResult(null);
    setScreen('camera');
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

    case 'success':
      return uploadResult ? (
        <SuccessScreen
          result={uploadResult}
          onScanAgain={handleScanAgain}
          onHome={goHome}
        />
      ) : null;

    default:
      return null;
  }
}

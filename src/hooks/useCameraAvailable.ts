import {
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

export interface CameraAvailability {
  available: boolean;
  needsPermission: boolean;
}

export function useCameraAvailable(): CameraAvailability {
  const device = useCameraDevice('front');
  const {hasPermission} = useCameraPermission();

  return {
    available: Boolean(device),
    needsPermission: !hasPermission,
  };
}

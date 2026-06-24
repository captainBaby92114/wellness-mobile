import {NativeModules} from 'react-native';
import type {
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';

type NativeImagePicker = {
  launchImageLibrary: (
    options: ImageLibraryOptions,
    callback: (result: ImagePickerResponse) => void,
  ) => void;
};

function getNativeImagePicker(): NativeImagePicker | null {
  // Turbo Module (New Architecture)
  // @ts-expect-error __turboModuleProxy is a RN runtime global
  if (global.__turboModuleProxy != null) {
    try {
      const turbo = require('react-native-image-picker/src/platforms/NativeImagePicker')
        .default as NativeImagePicker | null;
      if (turbo?.launchImageLibrary) {
        return turbo;
      }
    } catch {
      // Fall through to legacy module
    }
  }

  // Legacy bridge module
  const legacy = NativeModules.ImagePicker as NativeImagePicker | undefined;
  if (legacy?.launchImageLibrary) {
    return legacy;
  }

  return null;
}

const REBUILD_HINT =
  'Rebuild the app so the Photos picker native module is linked: cd wellness-mobile && npm run ios';

export function pickVideoFromPhotos(
  options: ImageLibraryOptions,
): Promise<ImagePickerResponse> {
  const native = getNativeImagePicker();
  if (!native) {
    return Promise.reject(new Error(REBUILD_HINT));
  }

  return new Promise(resolve => {
    native.launchImageLibrary(options, resolve);
  });
}

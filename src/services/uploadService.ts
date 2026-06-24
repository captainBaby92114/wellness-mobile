import {UPLOAD_URL} from '../config';
import type {UploadResult} from '../types';

export type {UploadResult};

export interface UploadOptions {
  videoUri: string;
  userId: string;
  consentTimestamp: string;
  consentVersion: string;
  captureTimestamp: string;
  deviceModel: string;
  onProgress: (percent: number) => void;
}

export function uploadVideo(options: UploadOptions): Promise<UploadResult> {
  const {
    videoUri,
    userId,
    consentTimestamp,
    consentVersion,
    captureTimestamp,
    deviceModel,
    onProgress,
  } = options;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();

    const sanitizedName = captureTimestamp.replace(/[:.]/g, '-');

    form.append('video', {
      uri: videoUri,
      type: 'video/mp4',
      name: `${sanitizedName}.mp4`,
    } as unknown as Blob);

    form.append('userId', userId);
    form.append('consentTimestamp', consentTimestamp);
    form.append('consentVersion', consentVersion);
    form.append('captureTimestamp', captureTimestamp);
    form.append('deviceModel', deviceModel);

    xhr.open('POST', UPLOAD_URL);

    xhr.upload.onprogress = event => {
      if (event.lengthComputable && event.total > 0) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as UploadResult);
        } catch {
          reject(new Error('Invalid response from server'));
        }
      } else {
        reject(new Error(`Upload failed (${xhr.status}): ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.onabort = () => reject(new Error('Upload aborted'));

    xhr.send(form);
  });
}

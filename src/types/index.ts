export interface VideoFormatInfo {
  videoWidth: number;
  videoHeight: number;
  maxFps: number;
}

export interface Metrics {
  heartRate: number | null;
  hrv: number | null;
  respiratoryRate: number | null;
  confidence: number | null;
  spo2: number | null;
  systolicBp: number | null;
  diastolicBp: number | null;
  sessionId: string;
}

export interface UploadResult {
  savedTo: 'local' | 's3';
  savedPath?: string;
  s3Key?: string;
  s3Url?: string;
  fileSizeBytes: number;
  uploadedAt: string;
  metadata: Record<string, string>;
  metrics: Metrics | null;
}

export type Screen =
  | 'home'
  | 'consent'
  | 'camera'
  | 'preview'
  | 'picker'
  | 'upload'
  | 'metrics';

import type {Metrics} from '../types';

type RawShenAiResult = {
  heart_rate?: number | null;
  heartRate?: number | null;
  hrv?: number | null;
  respiratory_rate?: number | null;
  respiratoryRate?: number | null;
  confidence?: number | null;
  spo2?: number | null;
  systolic_bp?: number | null;
  systolicBp?: number | null;
  diastolic_bp?: number | null;
  diastolicBp?: number | null;
  sessionId?: string;
};

type ShenAiModule = {
  getMeasurementResults: () => Promise<RawShenAiResult>;
};

function loadShenAi(): ShenAiModule | null {
  try {
    return require('react-native-shenai-sdk') as ShenAiModule;
  } catch {
    return null;
  }
}

function normalize(raw: RawShenAiResult, sdkDurationMs: number): Metrics {
  return {
    heartRate: raw.heart_rate ?? raw.heartRate ?? null,
    hrv: raw.hrv ?? null,
    respiratoryRate: raw.respiratory_rate ?? raw.respiratoryRate ?? null,
    confidence: raw.confidence ?? null,
    spo2: raw.spo2 ?? null,
    systolicBp: raw.systolic_bp ?? raw.systolicBp ?? null,
    diastolicBp: raw.diastolic_bp ?? raw.diastolicBp ?? null,
    sessionId: raw.sessionId ?? '',
    sdkDurationMs,
  };
}

export async function getShenAiMetrics(): Promise<Metrics | null> {
  const shenAi = loadShenAi();
  if (!shenAi?.getMeasurementResults) {
    return null;
  }

  try {
    const sdkStart = Date.now();
    const result = await shenAi.getMeasurementResults();
    return normalize(result, Date.now() - sdkStart);
  } catch {
    return null;
  }
}

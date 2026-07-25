import type { CrisisPlan } from '@/lib/ai';

/** Typed shape stored per active crisis alert */
export interface CrisisAlert extends CrisisPlan {
  transcript: string;
  timestamp: string;
  caregiverAcknowledged?: boolean;
  caregiverMessage?: string;
  patientSafeAck?: boolean;
  resolved?: boolean;
}

/** Typed shape of a caregiver's response message */
export interface CaregiverResponse {
  message: string;
  timestamp: string;
  patientSafeAck?: boolean;
}

export interface BeaconStore {
  latestCrisis: CrisisAlert | null;
  caregiverResponse: CaregiverResponse | null;
}

/** Singleton store that survives Next.js hot-reload via globalThis */
const globalForBeacon = globalThis as unknown as { __beaconStore: BeaconStore };

export const globalStore: BeaconStore =
  globalForBeacon.__beaconStore ??
  (globalForBeacon.__beaconStore = {
    latestCrisis: null,
    caregiverResponse: null,
  });

const globalForBeacon = globalThis as unknown as {
  globalStore: { latestCrisis: any; caregiverResponse: any };
};

export const globalStore =
  globalForBeacon.globalStore ||
  (globalForBeacon.globalStore = {
    latestCrisis: null,
    caregiverResponse: null,
  });

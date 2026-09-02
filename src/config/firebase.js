const REQUIRED_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

export function getFirebaseConfig(env = {}) {
  const resolved = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  const hasAllRequired = REQUIRED_KEYS.every((key) => {
    const value = env[key];
    return typeof value === 'string' && value.trim().length > 0 && !value.includes('PASTE');
  });

  if (!hasAllRequired) {
    return null;
  }

  return {
    apiKey: resolved.apiKey,
    authDomain: resolved.authDomain,
    projectId: resolved.projectId,
    storageBucket: resolved.storageBucket,
    messagingSenderId: resolved.messagingSenderId,
    appId: resolved.appId,
    ...(resolved.measurementId ? { measurementId: resolved.measurementId } : {}),
  };
}

export function hasFirebaseConfig(config) {
  if (!config || typeof config !== 'object') {
    return false;
  }

  return Boolean(
    config.apiKey &&
      config.authDomain &&
      config.projectId &&
      config.storageBucket &&
      config.messagingSenderId &&
      config.appId
  );
}

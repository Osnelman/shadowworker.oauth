import test from 'node:test';
import assert from 'node:assert/strict';

import { getFirebaseConfig, hasFirebaseConfig } from '../src/config/firebase.js';

test('returns a valid Firebase config when env values are present', () => {
  const config = getFirebaseConfig({
    VITE_FIREBASE_API_KEY: 'test-key',
    VITE_FIREBASE_AUTH_DOMAIN: 'app.firebaseapp.com',
    VITE_FIREBASE_PROJECT_ID: 'demo-project',
    VITE_FIREBASE_STORAGE_BUCKET: 'demo-project.appspot.com',
    VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
    VITE_FIREBASE_APP_ID: '1:123456789:web:abc',
    VITE_FIREBASE_MEASUREMENT_ID: 'G-ABCDE12345',
  });

  assert.equal(hasFirebaseConfig(config), true);
  assert.equal(config.apiKey, 'test-key');
});

test('fails gracefully when Firebase env values are missing', () => {
  const config = getFirebaseConfig({});

  assert.equal(hasFirebaseConfig(config), false);
  assert.equal(config, null);
});

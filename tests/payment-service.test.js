import test from 'node:test';
import assert from 'node:assert/strict';

import { getPaymentConfig, validatePaymentConfig, PAYMENT_PROVIDER } from '../src/services/paymentService.js';

test('payment config is disabled in free mode and ignores env values', () => {
  const config = getPaymentConfig({
    VITE_KKIAPAY_PUBLIC_KEY: 'public-key',
    VITE_KKIAPAY_SANDBOX: 'true',
    VITE_KKIAPAY_CHECKOUT_URL: 'https://checkout.example.com/pay',
  });

  assert.equal(config.provider, PAYMENT_PROVIDER);
  assert.equal(config.publicKey, null);
  assert.equal(config.sandbox, false);
  assert.equal(config.checkoutUrl, null);
  assert.equal(validatePaymentConfig(config), true);
});

test('payment config accepts free mode without requiring checkout configuration', () => {
  const config = getPaymentConfig({
    VITE_KKIAPAY_PUBLIC_KEY: 'public-key',
    VITE_KKIAPAY_SANDBOX: 'false',
  });

  assert.doesNotThrow(() => validatePaymentConfig(config));
  assert.equal(config.provider, PAYMENT_PROVIDER);
});

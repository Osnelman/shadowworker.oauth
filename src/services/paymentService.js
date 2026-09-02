export const PAYMENT_PROVIDER = 'free';

export function getPaymentConfig(env = import.meta.env) {
  void env;

  return {
    provider: PAYMENT_PROVIDER,
    publicKey: null,
    sandbox: false,
    checkoutUrl: null,
  };
}

export function validatePaymentConfig() {
  return true;
}

export function openPaymentCheckout() {
  return {
    provider: PAYMENT_PROVIDER,
    amount: 0,
    checkoutUrl: null,
    mode: 'free',
  };
}

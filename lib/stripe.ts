import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with public key from environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

export { stripePromise };
export default stripePromise;
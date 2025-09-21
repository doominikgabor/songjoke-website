// SongJoke Stripe Integration - Rebuilt for Production
// This file loads Stripe dynamically and handles payments

console.log('🎵 SongJoke Stripe integration loading...');

// Global variables
let stripe = null;
let isStripeLoaded = false;

// Your live Stripe configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51S97dPALWynO9zKwQ657Kan9zDS8BHSWkfIgYWrLOP7rv6KixJk40b9gRc0DgkLGLsxlP4NQs68Yj5AHs2XWzP5700capH6azI';
const PRICE_ID = 'price_1S9jvrALWynO9zKw0WCjdLYs';

// Dynamically load Stripe script
function loadStripeScript() {
    return new Promise((resolve, reject) => {
        if (window.Stripe) {
            console.log('✅ Stripe already loaded');
            resolve();
            return;
        }

        console.log('📦 Loading Stripe script...');
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.async = true;
        
        script.onload = function() {
            console.log('✅ Stripe script loaded successfully');
            resolve();
        };
        
        script.onerror = function() {
            console.error('❌ Failed to load Stripe script');
            reject(new Error('Failed to load Stripe'));
        };
        
        document.head.appendChild(script);
    });
}

// Initialize Stripe instance
async function initializeStripe() {
    try {
        if (!window.Stripe) {
            await loadStripeScript();
        }
        
        stripe = window.Stripe(STRIPE_PUBLISHABLE_KEY);
        isStripeLoaded = true;
        console.log('✅ Stripe initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Stripe initialization failed:', error);
        return false;
    }
}

// Create checkout session and redirect to Stripe
async function createCheckoutSession() {
    console.log('🚀 Creating checkout session...');
    
    // Ensure Stripe is loaded
    if (!isStripeLoaded) {
        console.log('⏳ Waiting for Stripe to load...');
        const success = await initializeStripe();
        if (!success) {
            alert('Payment system unavailable. Please try again later.');
            return;
        }
    }

    try {
        // Show loading state
        const button = document.activeElement;
        const originalText = button ? button.textContent : '';
        if (button) {
            button.textContent = 'Loading...';
            button.disabled = true;
        }

        // Create checkout session
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{
                price: PRICE_ID,
                quantity: 1,
            }],
            mode: 'payment',
            successUrl: window.location.origin + '/success.html',
            cancelUrl: window.location.origin + '/',
            currency: 'eur',
            submitType: 'pay',
            billingAddressCollection: 'auto',
            shippingAddressCollection: {
                allowedCountries: ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE']
            },
            metadata: {
                product: 'funny_birthday_song',
                service: 'songjoke'
            }
        });

        if (error) {
            console.error('❌ Stripe checkout error:', error);
            alert('Payment processing failed: ' + error.message);
            
            // Restore button
            if (button) {
                button.textContent = originalText;
                button.disabled = false;
            }
        }
    } catch (error) {
        console.error('❌ Checkout session error:', error);
        alert('Payment system error. Please try again.');
        
        // Restore button
        const button = document.activeElement;
        if (button) {
            button.textContent = originalText;
            button.disabled = false;
        }
    }
}

// Make function globally available
window.createCheckoutSession = createCheckoutSession;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🎵 SongJoke payment system initializing...');
    
    // Pre-load Stripe
    await initializeStripe();
    
    console.log('✅ Payment system ready!');
});

console.log('🎵 SongJoke Stripe integration loaded successfully');
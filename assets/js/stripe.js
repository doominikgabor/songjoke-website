// Stripe Integration for SongJoke
// Wait for Stripe to load, then initialize
let stripe;

function initializeStripe() {
    if (typeof Stripe !== 'undefined') {
        stripe = Stripe('pk_live_51S97dPALWynO9zKwQ657Kan9zDS8BHSWkfIgYWrLOP7rv6KixJk40b9gRc0DgkLGLsxlP4NQs68Yj5AHs2XWzP5700capH6azI');
        console.log('Stripe initialized successfully');
        return true;
    }
    return false;
}

// LIVE Price ID for €10 product
const PRICE_ID = 'price_1S9jvrALWynO9zKw0WCjdLYs';

// Stripe Checkout Configuration
const checkoutConfig = {
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
};

// Function to redirect to Stripe Checkout
function redirectToCheckout(event) {
    // Ensure Stripe is initialized
    if (!stripe && !initializeStripe()) {
        alert('Payment system loading... Please try again in a moment.');
        return;
    }

    // Add loading state to button
    const button = event ? event.target : document.activeElement;
    const originalContent = button ? button.innerHTML : '';
    if (button) {
        button.classList.add('loading');
        button.innerHTML = 'Processing...';
        button.disabled = true;
    }

    // Track the payment attempt
    if (typeof gtag !== 'undefined') {
        gtag('event', 'begin_checkout', {
            'currency': 'EUR',
            'value': 10.00,
            'items': [{
                'item_id': 'funny_birthday_song',
                'item_name': 'Personalized Funny Birthday Song',
                'category': 'Digital Product',
                'quantity': 1,
                'price': 10.00
            }]
        });
    }

    // Redirect to Stripe Checkout
    stripe.redirectToCheckout(checkoutConfig)
        .then(function (result) {
            // If redirectToCheckout fails due to a browser or network
            // error, display the localized error message to your customer
            if (result.error) {
                console.error('Stripe checkout error:', result.error);
                alert('Payment processing failed. Please try again or contact support.');
                
                // Restore button state
                button.classList.remove('loading');
                button.textContent = originalContent;
                button.disabled = false;
            }
        })
        .catch(function (error) {
            console.error('Stripe integration error:', error);
            alert('Payment system unavailable. Please try again later.');
            
            // Restore button state
            button.classList.remove('loading');
            button.textContent = originalContent;
            button.disabled = false;
        });
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all checkout buttons
    const checkoutButtons = [
        document.getElementById('checkout-button'),
        document.getElementById('checkout-button-2'),
        document.getElementById('checkout-button-3')
    ];

    // Add click event listeners to all checkout buttons
    checkoutButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                redirectToCheckout();
            });
        }
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effects
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // Add entrance animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.step, .genre-card, .testimonial, .faq-item');
    animateElements.forEach(el => observer.observe(el));
});

// Error handling for Stripe
window.addEventListener('error', function(event) {
    if (event.error && event.error.message && event.error.message.includes('Stripe')) {
        console.error('Stripe error detected:', event.error);
        // You could send this to your error tracking service
    }
});

// Configuration validation (development helper)
function validateStripeConfig() {
    if (PRICE_ID.includes('1234567890')) {
        console.warn('⚠️ IMPORTANT: Please replace the Stripe price ID with your actual price ID from Stripe Dashboard');
    }
    
    if (stripe._keyMode === 'test' && window.location.hostname !== 'localhost') {
        console.warn('⚠️ IMPORTANT: You are using test mode Stripe keys in production. Please update to live keys.');
    }
}

// Run validation in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    validateStripeConfig();
}

// Create checkout session function for HTML onclick
function createCheckoutSession() {
    console.log('createCheckoutSession called');
    redirectToCheckout();
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Stripe...');
    // Try to initialize Stripe immediately
    if (!initializeStripe()) {
        // If Stripe isn't ready, wait a bit and try again
        setTimeout(function() {
            if (!initializeStripe()) {
                console.warn('Stripe failed to load after waiting');
            }
        }, 1000);
    }
});

// Export for potential use in other scripts
window.SongJokeStripe = {
    redirectToCheckout,
    createCheckoutSession,
    stripe,
    config: checkoutConfig
};

// Make function globally available
window.createCheckoutSession = createCheckoutSession;
// Main JavaScript for SongJoke Form Validation and UI Interactions

// Security utilities
function generateCSRFToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function encryptData(data) {
    // Simple encoding for form data (not for sensitive data)
    return btoa(JSON.stringify(data));
}

function decryptData(encodedData) {
    try {
        return JSON.parse(atob(encodedData));
    } catch (e) {
        return {};
    }
}

// Form validation configuration
const validationRules = {
    customer_name: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
        message: 'Please enter a valid name (letters only, minimum 2 characters)'
    },
    customer_email: {
        required: true,
        pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        message: 'Please enter a valid email address'
    },
    recipient_name: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
        message: 'Please enter a valid name (letters only, minimum 2 characters)'
    },
    relationship: {
        required: true,
        minLength: 3,
        message: 'Please describe your relationship (e.g., girlfriend, best friend, brother)'
    },
    favorite_things: {
        required: true,
        minLength: 20,
        message: 'Please provide more details (at least 20 characters) to make the song funnier!'
    },
    personality_traits: {
        required: true,
        minLength: 20,
        message: 'Please describe their personality in more detail (at least 20 characters)'
    },
    special_memories: {
        required: true,
        minLength: 20,
        message: 'Please share some special memories (at least 20 characters) for a personal touch'
    },
    music_genre: {
        required: true,
        message: 'Please select a music genre for their song'
    }
};

// Validation functions
function validateField(fieldName, value) {
    const rules = validationRules[fieldName];
    if (!rules) return { isValid: true };

    // Check required
    if (rules.required && (!value || value.trim() === '')) {
        return { isValid: false, message: `This field is required` };
    }

    // Check minimum length
    if (rules.minLength && value && value.trim().length < rules.minLength) {
        return { isValid: false, message: rules.message || `Minimum ${rules.minLength} characters required` };
    }

    // Check pattern
    if (rules.pattern && value && !rules.pattern.test(value.trim())) {
        return { isValid: false, message: rules.message || 'Invalid format' };
    }

    return { isValid: true };
}

function showFieldError(fieldElement, message) {
    const formGroup = fieldElement.closest('.form-group');
    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        fieldElement.parentNode.insertBefore(errorElement, fieldElement.nextSibling);
    }
    errorElement.textContent = message;
}

function showFieldSuccess(fieldElement) {
    const formGroup = fieldElement.closest('.form-group');
    formGroup.classList.add('success');
    formGroup.classList.remove('error');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function validateForm() {
    const form = document.getElementById('songOrderForm');
    if (!form) return false;

    let isFormValid = true;
    const formData = new FormData(form);

    // Validate each field
    Object.keys(validationRules).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            const value = formData.get(fieldName);
            const validation = validateField(fieldName, value);
            
            if (!validation.isValid) {
                showFieldError(field, validation.message);
                isFormValid = false;
                
                // Focus on first error field
                if (isFormValid) {
                    field.focus();
                }
            } else if (value && value.trim() !== '') {
                showFieldSuccess(field);
            }
        }
    });

    return isFormValid;
}

// Real-time validation
function setupRealtimeValidation() {
    const form = document.getElementById('songOrderForm');
    if (!form) return;

    Object.keys(validationRules).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            // Validate on blur
            field.addEventListener('blur', function() {
                const validation = validateField(fieldName, this.value);
                if (!validation.isValid) {
                    showFieldError(this, validation.message);
                } else if (this.value.trim() !== '') {
                    showFieldSuccess(this);
                }
            });

            // Clear errors on input for better UX
            field.addEventListener('input', function() {
                const formGroup = this.closest('.form-group');
                if (formGroup.classList.contains('error')) {
                    const validation = validateField(fieldName, this.value);
                    if (validation.isValid && this.value.trim() !== '') {
                        showFieldSuccess(this);
                    }
                }
            });
        }
    });
}

// Form submission handling
function setupFormSubmission() {
    const form = document.getElementById('songOrderForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!form || !submitBtn) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            // Scroll to first error
            const firstError = document.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Show loading state
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = `<span class="loading-spinner"></span> Creating Your Song...`;
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');

        // Track form submission
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                'event_category': 'Song Order',
                'event_label': 'Customer Details Form'
            });
        }

        // Add CSRF token and security headers
        const formData = new FormData(form);
        formData.append('_token', generateCSRFToken());
        formData.append('_timestamp', Date.now());
        
        fetch('/', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: new URLSearchParams(formData).toString()
        })
        .then(response => {
            if (response.ok) {
                // Success! Redirect to thank you page
                window.location.href = '/thank-you.html';
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            alert('There was an error submitting your form. Please try again or contact support.');
            
            // Restore button state
            submitBtn.textContent = originalContent;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        });
    });
}

// Character count for textareas
function setupCharacterCounts() {
    const textareas = document.querySelectorAll('textarea[required]');
    
    textareas.forEach(textarea => {
        const rules = validationRules[textarea.name];
        if (rules && rules.minLength) {
            const container = textarea.closest('.form-group');
            const counterElement = document.createElement('div');
            counterElement.className = 'char-counter';
            counterElement.style.cssText = 'font-size: 0.8rem; color: #666; margin-top: 0.25rem; text-align: right;';
            
            textarea.parentNode.insertBefore(counterElement, textarea.nextSibling);
            
            function updateCounter() {
                const current = textarea.value.length;
                const min = rules.minLength;
                const remaining = Math.max(0, min - current);
                
                if (remaining > 0) {
                    counterElement.textContent = `${remaining} more characters needed`;
                    counterElement.style.color = '#FF6B6B';
                } else {
                    counterElement.textContent = `${current} characters - great detail! 🎉`;
                    counterElement.style.color = '#28a745';
                }
            }
            
            textarea.addEventListener('input', updateCounter);
            updateCounter(); // Initial count
        }
    });
}

// Progress saving (localStorage)
function setupProgressSaving() {
    const form = document.getElementById('songOrderForm');
    if (!form) return;

    const STORAGE_KEY = 'songjoke_form_data';
    
    // Load saved data
    function loadSavedData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                Object.keys(data).forEach(key => {
                    const field = form.querySelector(`[name="${key}"]`);
                    if (field && data[key]) {
                        field.value = data[key];
                    }
                });
            }
        } catch (error) {
            console.log('Could not load saved form data:', error);
        }
    }
    
    // Save data on input
    function saveFormData() {
        try {
            const formData = new FormData(form);
            const data = {};
            for (let [key, value] of formData.entries()) {
                if (key !== 'form-name' && key !== 'order_id') {
                    data[key] = value;
                }
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.log('Could not save form data:', error);
        }
    }
    
    // Clear saved data on successful submission
    function clearSavedData() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.log('Could not clear saved data:', error);
        }
    }
    
    // Load data on page load
    loadSavedData();
    
    // Save on input changes
    form.addEventListener('input', debounce(saveFormData, 1000));
    
    // Clear on form submission
    form.addEventListener('submit', clearSavedData);
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced UX features
function setupEnhancedUX() {
    // Auto-focus first empty required field
    const form = document.getElementById('songOrderForm');
    if (form) {
        const firstEmptyRequired = form.querySelector('input[required]:not([value]), textarea[required]:empty, select[required]:not([value])');
        if (firstEmptyRequired) {
            setTimeout(() => firstEmptyRequired.focus(), 500);
        }
    }
    
    // Encourage completion with motivational messages
    const textareas = document.querySelectorAll('textarea[required]');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            if (this.value.length > 50) {
                const formGroup = this.closest('.form-group');
                const encouragement = formGroup.querySelector('.encouragement');
                if (!encouragement) {
                    const msg = document.createElement('div');
                    msg.className = 'encouragement';
                    msg.style.cssText = 'color: #28a745; font-size: 0.8rem; margin-top: 0.25rem; font-weight: bold;';
                    msg.textContent = '🎉 Perfect! This level of detail will make their song hilarious!';
                    this.parentNode.appendChild(msg);
                }
            }
        });
    });
}

// Mobile-specific enhancements
function setupMobileEnhancements() {
    // Prevent zoom on input focus on iOS
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                input.style.fontSize = '16px';
            });
            input.addEventListener('blur', function() {
                input.style.fontSize = '';
            });
        });
    }
    
    // Better mobile keyboard types
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.setAttribute('inputmode', 'email');
    });
}

// Analytics tracking
function setupAnalytics() {
    // Track form engagement
    const form = document.getElementById('songOrderForm');
    if (form && typeof gtag !== 'undefined') {
        let hasStartedForm = false;
        
        form.addEventListener('input', function() {
            if (!hasStartedForm) {
                hasStartedForm = true;
                gtag('event', 'form_start', {
                    'event_category': 'Song Order',
                    'event_label': 'Customer Details Form'
                });
            }
        });
        
        // Track field completion
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                if (this.value.trim() !== '') {
                    gtag('event', 'form_field_complete', {
                        'event_category': 'Song Order',
                        'event_label': this.name
                    });
                }
            });
        });
    }
}

// Error tracking
function setupErrorTracking() {
    window.addEventListener('error', function(event) {
        console.error('JavaScript error:', event.error);
        
        // Track critical errors
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': event.error ? event.error.toString() : 'Unknown error',
                'fatal': false
            });
        }
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Core functionality
    setupRealtimeValidation();
    setupFormSubmission();
    setupCharacterCounts();
    setupProgressSaving();
    
    // Enhanced UX
    setupEnhancedUX();
    setupMobileEnhancements();
    
    // Analytics and tracking
    setupAnalytics();
    setupErrorTracking();
    
    // Add loading state styles if not in CSS
    if (!document.querySelector('style[data-songjoke-loading]')) {
        const style = document.createElement('style');
        style.setAttribute('data-songjoke-loading', 'true');
        style.textContent = `
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255,255,255,0.3);
                border-radius: 50%;
                border-top-color: #fff;
                animation: spin 1s linear infinite;
                margin-right: 8px;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    console.log('🎵 SongJoke form initialized successfully!');
});
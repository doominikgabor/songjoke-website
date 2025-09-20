// Ultra Modern SongJoke - Interactive Animations & Effects

// Particle System
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.init();
    }

    init() {
        const particleContainer = document.querySelector('.particles');
        if (!particleContainer) return;

        this.createParticles(particleContainer);
        this.animate();
    }

    createParticles(container) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size and position
            const size = Math.random() * 4 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 5) + 's';
            
            container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    animate() {
        // Continuous particle animation handled by CSS
    }
}

// Scroll Reveal Animation System
class ScrollReveal {
    constructor() {
        this.elements = document.querySelectorAll('.reveal');
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    entry.target.style.animationDelay = `${Math.random() * 0.3}s`;
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        this.elements.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// Dynamic Header Effects
class HeaderEffects {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.header.classList.add('scrolled');
            } else {
                this.header.classList.remove('scrolled');
            }
        });
    }
}

// Interactive Button Effects
class ButtonEffects {
    constructor() {
        this.buttons = document.querySelectorAll('.cta-button');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.createRipple(e);
            });

            button.addEventListener('click', (e) => {
                this.createClickEffect(e);
            });
        });
    }

    createRipple(e) {
        const button = e.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createClickEffect(e) {
        const button = e.currentTarget;
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
}

// Parallax Effects
class ParallaxEffects {
    constructor() {
        this.elements = document.querySelectorAll('.parallax');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            this.elements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }
}

// Smooth Scroll Navigation
class SmoothScroll {
    constructor() {
        this.links = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Loading Animation System
class LoadingSystem {
    constructor() {
        this.init();
    }

    init() {
        // Add page load animation
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            this.animateElements();
        });
    }

    animateElements() {
        // Animate hero elements with stagger
        const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-description, .hero-features, .cta-button');
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('fade-in');
            }, index * 200);
        });
    }
}

// Interactive Card Hover Effects
class CardEffects {
    constructor() {
        this.cards = document.querySelectorAll('.step, .genre-card, .testimonial, .faq-item');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.handleHover(e);
            });

            card.addEventListener('mousemove', (e) => {
                this.handleMouseMove(e);
            });

            card.addEventListener('mouseleave', (e) => {
                this.handleLeave(e);
            });
        });
    }

    handleHover(e) {
        const card = e.currentTarget;
        card.style.transition = 'transform 0.3s ease';
    }

    handleMouseMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    }

    handleLeave(e) {
        const card = e.currentTarget;
        card.style.transform = '';
    }
}

// Animated Counter System
class AnimatedCounters {
    constructor() {
        this.counters = document.querySelectorAll('.counter');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                }
            });
        });

        this.counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const start = performance.now();

        const animate = (current) => {
            const elapsed = current - start;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(target * this.easeOutCubic(progress));
            
            counter.textContent = value;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}

// Typing Animation Effect
class TypingEffect {
    constructor() {
        this.elements = document.querySelectorAll('.typing-effect');
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            this.typeText(element);
        });
    }

    typeText(element) {
        const text = element.textContent;
        element.textContent = '';
        
        let index = 0;
        const interval = setInterval(() => {
            element.textContent += text[index];
            index++;
            
            if (index >= text.length) {
                clearInterval(interval);
            }
        }, 50);
    }
}

// Enhanced Form Experience
class FormExperience {
    constructor() {
        this.forms = document.querySelectorAll('form');
        this.init();
    }

    init() {
        this.forms.forEach(form => {
            this.enhanceForm(form);
        });
    }

    enhanceForm(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Floating labels effect
            input.addEventListener('focus', () => {
                input.closest('.form-group').classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.closest('.form-group').classList.remove('focused');
                }
            });

            // Initial state
            if (input.value) {
                input.closest('.form-group').classList.add('focused');
            }
        });
    }
}

// Mouse Trail Effect
class MouseTrail {
    constructor() {
        this.trail = [];
        this.maxTrail = 20;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.addTrailPoint(e.clientX, e.clientY);
            this.updateTrail();
        });
    }

    addTrailPoint(x, y) {
        this.trail.push({ x, y, life: 1 });
        
        if (this.trail.length > this.maxTrail) {
            this.trail.shift();
        }
    }

    updateTrail() {
        this.trail.forEach((point, index) => {
            point.life -= 0.05;
            
            if (point.life <= 0) {
                this.trail.splice(index, 1);
            }
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Monitor FPS
        let lastTime = performance.now();
        let frames = 0;
        
        const checkFPS = (currentTime) => {
            frames++;
            
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                
                if (fps < 30) {
                    this.reduceAnimations();
                }
                
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(checkFPS);
        };
        
        requestAnimationFrame(checkFPS);
    }

    reduceAnimations() {
        document.body.classList.add('reduced-motion');
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Core visual effects
    new ParticleSystem();
    new ScrollReveal();
    new HeaderEffects();
    new ButtonEffects();
    new SmoothScroll();
    new LoadingSystem();
    new CardEffects();
    
    // Enhanced interactions
    new FormExperience();
    new AnimatedCounters();
    
    // Performance monitoring
    new PerformanceMonitor();
    
    // Add CSS for additional effects
    const style = document.createElement('style');
    style.textContent = `
        /* Ripple Effect */
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        /* Loading State */
        body:not(.loaded) .hero-title,
        body:not(.loaded) .hero-subtitle,
        body:not(.loaded) .hero-description {
            opacity: 0;
            transform: translateY(30px);
        }
        
        /* Reduced Motion */
        .reduced-motion * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        /* Enhanced Form Groups */
        .form-group.focused label {
            transform: translateY(-20px) scale(0.8);
            color: #ff6b6b;
        }
        
        .form-group label {
            transition: all 0.3s ease;
            transform-origin: left;
        }
        
        /* Counter Animation */
        .counter {
            font-weight: bold;
            color: #ff6b6b;
        }
        
        /* Hover Glow Effects */
        .genre-card:hover,
        .step:hover {
            box-shadow: 0 20px 40px rgba(255, 107, 107, 0.3);
        }
        
        /* Text Shadow Animation */
        .hero-title {
            text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
            animation: textGlow 3s ease-in-out infinite alternate;
        }
        
        @keyframes textGlow {
            from { text-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
            to { text-shadow: 0 0 30px rgba(255, 107, 107, 0.8), 0 0 40px rgba(255, 230, 109, 0.6); }
        }
    `;
    document.head.appendChild(style);
    
    console.log('🎵 SongJoke Ultra Modern Experience Loaded! ✨');
});

// Add scroll-based parallax for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero');
    if (parallax) {
        const speed = 0.5;
        parallax.style.transform = `translateY(${scrolled * speed}px)`;
    }
});

// Auto-play entrance animations
window.addEventListener('load', () => {
    // Stagger animation for hero elements
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((element, index) => {
        element.style.animation = `fadeIn 1s ease-out ${index * 0.2}s both`;
    });
});
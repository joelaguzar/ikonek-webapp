// Animations Module

class AnimationsManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupCounterAnimation();
    }
    
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger counter animation for stats
                    if (entry.target.classList.contains('stat-value') ||
                        entry.target.classList.contains('about-stat-value')) {
                        this.animateCounter(entry.target);
                    }
                }
            });
        }, options);
        
        // Observe all cards and sections
        const elements = document.querySelectorAll(`
            .card,
            .step-card,
            .value-card,
            .stat-item,
            .about-stat,
            .trusted-by-card
        `);
        
        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
        
        // Add styles for animated elements
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupCounterAnimation() {
        // This will be triggered by the intersection observer
    }
    
    animateCounter(element) {
        const text = element.textContent;
        const hasPhp = text.includes('₱');
        const hasPlus = text.includes('+');
        const hasM = text.includes('M');
        
        // Extract number
        let targetNumber = parseInt(text.replace(/[^\d]/g, ''));
        
        if (hasM) {
            targetNumber = targetNumber; // Keep as is for millions
        }
        
        let currentNumber = 0;
        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = targetNumber / steps;
        const stepDuration = duration / steps;
        
        const counter = setInterval(() => {
            currentNumber += increment;
            
            if (currentNumber >= targetNumber) {
                currentNumber = targetNumber;
                clearInterval(counter);
            }
            
            let displayText = Math.floor(currentNumber).toLocaleString();
            
            if (hasPhp && hasM) {
                displayText = `₱${displayText}M`;
            } else if (hasPhp) {
                displayText = `₱${displayText}`;
            }
            
            if (hasPlus) {
                displayText += '+';
            }
            
            element.textContent = displayText;
        }, stepDuration);
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    new AnimationsManager();
});

export default AnimationsManager;

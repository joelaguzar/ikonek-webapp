// Main Application File

// Import modules
import Navigation from './modules/navigation.js';
import CampaignsManager from './modules/campaigns.js';
import HospitalsManager from './modules/hospitals.js';
import AnimationsManager from './modules/animations.js';

class App {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('iKonek App Initialized');
        
        // Initialize all modules
        this.navigation = new Navigation();
        this.campaignsManager = new CampaignsManager();
        this.hospitalsManager = new HospitalsManager();
        this.animationsManager = new AnimationsManager();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Show loading complete
        this.hideLoader();
    }
    
    setupEventListeners() {
        // Button click handlers
        document.querySelectorAll('.btn-primary, .btn-outline').forEach(button => {
            button.addEventListener('click', (e) => {
                const text = button.textContent.trim();
                
                if (text.includes('Login')) {
                    this.handleLogin();
                } else if (text.includes('Register')) {
                    this.handleRegister();
                } else if (text.includes('Donate')) {
                    this.handleDonate(button);
                }
            });
        });
        
        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    handleLogin() {
        console.log('Login clicked');
        // Add your login logic here
        alert('Login functionality will be implemented in the next phase.');
    }
    
    handleRegister() {
        console.log('Register clicked');
        // Add your registration logic here
        alert('Registration functionality will be implemented in the next phase.');
    }
    
    handleDonate(button) {
        console.log('Donate clicked');
        // Add your donation logic here
        const card = button.closest('.campaign-card');
        const title = card ? card.querySelector('.campaign-title').textContent : 'this campaign';
        alert(`Donation functionality for "${title}" will be implemented in the next phase.`);
    }
    
    hideLoader() {
        // If you add a loader, hide it here
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 500);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.iKonekApp = new App();
});

// Export for use in other modules
export default App;

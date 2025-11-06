// Navigation Module - Enhanced UX

class Navigation {
    constructor() {
        this.nav = document.getElementById('mainNav');
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.navLinks = document.getElementById('navLinks');
        this.navOverlay = document.getElementById('navOverlay');
        this.links = document.querySelectorAll('.nav-link');
        this.lastScroll = 0;
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.nav) return;
        
        this.setupMobileMenu();
        this.setupScrollBehavior();
        this.setupSmoothScroll();
        this.setupActiveLink();
        this.setupKeyboardNavigation();
        this.handleResize();
    }
    
    /**
     * Mobile Menu Functionality
     */
    setupMobileMenu() {
        if (!this.menuToggle) return;
        
        // Toggle menu on button click
        this.menuToggle.addEventListener('click', () => {
            this.toggleMenu();
        });
        
        // Close menu when clicking overlay
        if (this.navOverlay) {
            this.navOverlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }
        
        // Close menu when clicking on a link
        this.links.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Prevent body scroll when menu is open
        this.navLinks?.addEventListener('touchmove', (e) => {
            if (this.isMenuOpen) {
                e.stopPropagation();
            }
        }, { passive: true });
    }
    
    /**
     * Toggle Menu State
     */
    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            this.openMenu();
        } else {
            this.closeMenu();
        }
    }
    
    /**
     * Open Mobile Menu
     */
    openMenu() {
        this.isMenuOpen = true;
        this.menuToggle?.classList.add('active');
        this.navLinks?.classList.add('active');
        this.navOverlay?.classList.add('active');
        this.menuToggle?.setAttribute('aria-expanded', 'true');
        this.menuToggle?.setAttribute('aria-label', 'Close navigation menu');
        this.navOverlay?.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus first link for accessibility
        setTimeout(() => {
            this.links[0]?.focus();
        }, 300);
    }
    
    /**
     * Close Mobile Menu
     */
    closeMenu() {
        this.isMenuOpen = false;
        this.menuToggle?.classList.remove('active');
        this.navLinks?.classList.remove('active');
        this.navOverlay?.classList.remove('active');
        this.menuToggle?.setAttribute('aria-expanded', 'false');
        this.menuToggle?.setAttribute('aria-label', 'Open navigation menu');
        this.navOverlay?.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
    
    /**
     * Enhanced Scroll Behavior
     */
    setupScrollBehavior() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }
    
    /**
     * Handle Scroll Effects
     */
    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow and shrink on scroll
        if (currentScroll > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
        
        // Close mobile menu on scroll
        if (this.isMenuOpen && Math.abs(currentScroll - this.lastScroll) > 50) {
            this.closeMenu();
        }
        
        this.lastScroll = currentScroll;
    }
    
    /**
     * Smooth Scroll with Offset
     */
    setupSmoothScroll() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const target = document.getElementById(targetId);
                    
                    if (target) {
                        const navHeight = this.nav.offsetHeight;
                        const targetPosition = target.offsetTop - navHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Update URL without jumping
                        history.pushState(null, null, href);
                        
                        // Set focus for accessibility
                        target.setAttribute('tabindex', '-1');
                        target.focus({ preventScroll: true });
                    }
                }
            });
        });
    }
    
    /**
     * Active Link Based on Scroll Position
     */
    setupActiveLink() {
        const sections = Array.from(this.links).map(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const id = href.substring(1);
                return document.getElementById(id);
            }
            return null;
        }).filter(Boolean);
        
        if (sections.length === 0) return;
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    this.updateActiveLink(sections);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Initial check
        this.updateActiveLink(sections);
    }
    
    /**
     * Update Active Link
     */
    updateActiveLink(sections) {
        const scrollPos = window.pageYOffset + this.nav.offsetHeight + 100;
        const windowHeight = window.innerHeight;
        
        let currentSection = null;
        
        // Find the section that's currently most visible in the viewport
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            // Check if section is in viewport
            if (sectionTop <= scrollPos && sectionBottom > scrollPos) {
                currentSection = section;
            }
        });
        
        // If no section found (at top of page), highlight the hero/first section
        if (!currentSection && scrollPos < (sections[0]?.offsetTop + 200)) {
            currentSection = sections[0];
        }
        
        // Update active class
        this.links.forEach(link => {
            link.classList.remove('active');
            if (currentSection) {
                const href = link.getAttribute('href');
                if (href === `#${currentSection.id}`) {
                    link.classList.add('active');
                }
            }
        });
    }
    
    /**
     * Keyboard Navigation Support
     */
    setupKeyboardNavigation() {
        // ESC key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
                this.menuToggle?.focus();
            }
        });
        
        // Tab trapping in mobile menu
        if (this.navLinks) {
            this.navLinks.addEventListener('keydown', (e) => {
                if (!this.isMenuOpen) return;
                
                if (e.key === 'Tab') {
                    const focusableElements = this.navLinks.querySelectorAll(
                        'a, button, [tabindex]:not([tabindex="-1"])'
                    );
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];
                    
                    if (e.shiftKey && document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    } else if (!e.shiftKey && document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            });
        }
    }
    
    /**
     * Handle Window Resize
     */
    handleResize() {
        let resizeTimer;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                // Close menu on desktop resize
                if (window.innerWidth > 768 && this.isMenuOpen) {
                    this.closeMenu();
                }
            }, 250);
        });
    }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});

export default Navigation;


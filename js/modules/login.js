/**
 * Login Module
 * Handles login form validation, submission, and password visibility toggle
 */

class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.togglePasswordBtn = document.getElementById('togglePassword');
        this.rememberCheckbox = document.getElementById('remember');
        this.submitBtn = this.form.querySelector('.btn-login');
        
        this.init();
    }

    init() {
        this.attachEventListeners();
        this.checkRememberedEmail();
    }

    attachEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.emailInput.addEventListener('blur', () => this.validateEmail());
        this.passwordInput.addEventListener('blur', () => this.validatePassword());
        
        // Clear errors on input
        this.emailInput.addEventListener('input', () => this.clearError('email'));
        this.passwordInput.addEventListener('input', () => this.clearError('password'));
        
        // Password visibility toggle
        this.togglePasswordBtn.addEventListener('click', () => this.togglePasswordVisibility());
        
        // Keyboard accessibility for password toggle
        this.togglePasswordBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.togglePasswordVisibility();
            }
        });
    }

    /**
     * Validate email format
     */
    validateEmail() {
        const email = this.emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError('email', 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError('email', 'Please enter a valid email address');
            return false;
        }
        
        this.clearError('email');
        return true;
    }

    /**
     * Validate password
     */
    validatePassword() {
        const password = this.passwordInput.value;
        
        if (!password) {
            this.showError('password', 'Password is required');
            return false;
        }
        
        if (password.length < 6) {
            this.showError('password', 'Password must be at least 6 characters');
            return false;
        }
        
        this.clearError('password');
        return true;
    }

    /**
     * Show error message
     */
    showError(fieldName, message) {
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('active');
        
        // Announce error to screen readers
        errorElement.setAttribute('aria-live', 'polite');
    }

    /**
     * Clear error message
     */
    clearError(fieldName) {
        const input = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        input.classList.remove('error');
        errorElement.textContent = '';
        errorElement.classList.remove('active');
    }

    /**
     * Toggle password visibility
     */
    togglePasswordVisibility() {
        const type = this.passwordInput.getAttribute('type');
        const eyeOff = this.togglePasswordBtn.querySelector('.eye-off');
        const eyeOn = this.togglePasswordBtn.querySelector('.eye-on');
        
        if (type === 'password') {
            this.passwordInput.setAttribute('type', 'text');
            eyeOff.style.display = 'none';
            eyeOn.style.display = 'block';
            this.togglePasswordBtn.setAttribute('aria-label', 'Hide password');
        } else {
            this.passwordInput.setAttribute('type', 'password');
            eyeOff.style.display = 'block';
            eyeOn.style.display = 'none';
            this.togglePasswordBtn.setAttribute('aria-label', 'Show password');
        }
    }

    /**
     * Check for remembered email
     */
    checkRememberedEmail() {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            this.emailInput.value = rememberedEmail;
            this.rememberCheckbox.checked = true;
        }
    }

    /**
     * Handle remember me functionality
     */
    handleRememberMe(email) {
        if (this.rememberCheckbox.checked) {
            localStorage.setItem('rememberedEmail', email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
    }

    /**
     * Show loading state
     */
    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
            this.submitBtn.setAttribute('aria-busy', 'true');
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
            this.submitBtn.setAttribute('aria-busy', 'false');
        }
    }

    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();
        
        if (!isEmailValid || !isPasswordValid) {
            // Focus on first invalid field
            if (!isEmailValid) {
                this.emailInput.focus();
            } else if (!isPasswordValid) {
                this.passwordInput.focus();
            }
            return;
        }
        
        // Get form data
        const formData = {
            email: this.emailInput.value.trim(),
            password: this.passwordInput.value,
            remember: this.rememberCheckbox.checked
        };
        
        // Handle remember me
        this.handleRememberMe(formData.email);
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Simulate API call (replace with actual API call)
            await this.login(formData);
            
            // Success - redirect or show success message
            this.handleLoginSuccess();
            
        } catch (error) {
            // Error handling
            this.handleLoginError(error);
        } finally {
            this.setLoadingState(false);
        }
    }

    /**
     * Login API call (mock implementation)
     * Replace this with actual API integration
     */
    async login(credentials) {
        // Simulate API delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Mock validation
                if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
                    resolve({ success: true, token: 'mock-token' });
                } else {
                    reject(new Error('Invalid email or password'));
                }
            }, 1500);
        });
    }

    /**
     * Handle successful login
     */
    handleLoginSuccess() {
        // Store authentication token (if using token-based auth)
        // localStorage.setItem('authToken', response.token);
        
        // Show success message
        this.showSuccessMessage();
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
            window.location.href = '../index.html'; // Change to dashboard page
        }, 1000);
    }

    /**
     * Handle login error
     */
    handleLoginError(error) {
        const errorMessage = error.message || 'An error occurred. Please try again.';
        
        // Show error on password field (most common case)
        this.showError('password', errorMessage);
        
        // Focus password field for retry
        this.passwordInput.focus();
        
        // Optional: Show toast notification
        this.showToast(errorMessage, 'error');
    }

    /**
     * Show success message
     */
    showSuccessMessage() {
        this.showToast('Login successful! Redirecting...', 'success');
    }

    /**
     * Show toast notification
     * This is a simple implementation - you can enhance this
     */
    showToast(message, type = 'info') {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'error' ? '#DC3545' : '#28A745'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
            font-size: 14px;
            max-width: 400px;
        `;
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LoginManager();
});

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Schedule Donation Step 2 - Contact Information Form Module

class ContactInfoForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.continueBtn = document.getElementById('continueBtn');
        this.previousBtn = document.getElementById('previousBtn');
        this.emailInput = document.getElementById('email');
        this.phoneInput = document.getElementById('phone');
        this.phoneCountrySelect = document.getElementById('phoneCountry');
        this.emergencyNameInput = document.getElementById('emergencyName');
        this.emergencyPhoneInput = document.getElementById('emergencyPhone');
        this.emergencyPhoneCountrySelect = document.getElementById('emergencyPhoneCountry');
        
        this.init();
    }

    init() {
        // Load previous step data
        this.loadPreviousStepData();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initial validation check
        this.validateForm();
    }

    loadPreviousStepData() {
        const formData = localStorage.getItem('scheduleFormData');
        if (!formData) {
            // Redirect back to step 1 if no data found
            this.showMessage('Please complete Step 1 first', 'error');
            setTimeout(() => {
                window.location.href = 'schedule-donation.html';
            }, 2000);
            return;
        }
        
        // Load saved contact info if exists
        const contactData = localStorage.getItem('contactFormData');
        if (contactData) {
            try {
                const data = JSON.parse(contactData);
                if (data.email) this.emailInput.value = data.email;
                if (data.phone) this.phoneInput.value = data.phone;
                if (data.phoneCountry) this.phoneCountrySelect.value = data.phoneCountry;
                if (data.emergencyName) this.emergencyNameInput.value = data.emergencyName;
                if (data.emergencyPhone) this.emergencyPhoneInput.value = data.emergencyPhone;
                if (data.emergencyPhoneCountry) this.emergencyPhoneCountrySelect.value = data.emergencyPhoneCountry;
                
                // Validate loaded fields
                setTimeout(() => {
                    if (data.email) this.validateField(this.emailInput, 'email');
                    if (data.phone) this.validateField(this.phoneInput, 'phone');
                    if (data.emergencyName) this.validateField(this.emergencyNameInput, 'text');
                    if (data.emergencyPhone) this.validateField(this.emergencyPhoneInput, 'phone');
                    this.validateForm();
                }, 100);
            } catch (e) {
                console.error('Error loading contact data:', e);
            }
        }
    }

    addEventListeners() {
        // Email validation
        this.emailInput.addEventListener('blur', (e) => {
            this.validateField(e.target, 'email');
            this.validateForm();
        });

        this.emailInput.addEventListener('input', () => {
            this.validateForm();
        });

        // Phone validation
        this.phoneInput.addEventListener('blur', (e) => {
            this.validateField(e.target, 'phone');
            this.validateForm();
        });

        this.phoneInput.addEventListener('input', (e) => {
            this.formatPhoneNumber(e.target);
            this.validateForm();
        });

        // Emergency name validation
        this.emergencyNameInput.addEventListener('blur', (e) => {
            this.validateField(e.target, 'text');
            this.validateForm();
        });

        this.emergencyNameInput.addEventListener('input', () => {
            this.validateForm();
        });

        // Emergency phone validation
        this.emergencyPhoneInput.addEventListener('blur', (e) => {
            this.validateField(e.target, 'phone');
            this.validateForm();
        });

        this.emergencyPhoneInput.addEventListener('input', (e) => {
            this.formatPhoneNumber(e.target);
            this.validateForm();
        });

        // Focus handlers to remove validation states
        [this.emailInput, this.phoneInput, this.emergencyNameInput, this.emergencyPhoneInput].forEach(input => {
            input.addEventListener('focus', (e) => this.handleFieldFocus(e.target));
        });

        // Button handlers
        this.continueBtn.addEventListener('click', () => this.handleContinue());
        this.previousBtn.addEventListener('click', () => this.handlePrevious());

        // Auto-save on input
        let autoSaveTimeout;
        this.form.addEventListener('input', () => {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => this.autoSave(), 1500);
        });

        // Prevent form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContinue();
        });
        
        // Setup help tooltips
        this.setupHelpTooltips();
    }
    
    setupHelpTooltips() {
        const helpIcons = document.querySelectorAll('.help-icon');
        helpIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                const title = icon.getAttribute('title');
                this.showTooltip(title, icon);
            });
        });
    }
    
    showTooltip(message, element) {
        // Remove existing tooltips
        document.querySelectorAll('.custom-tooltip').forEach(t => t.remove());
        
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = message;
        tooltip.style.cssText = `
            position: absolute;
            background: #1D3557;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 13px;
            line-height: 18px;
            max-width: 280px;
            z-index: 1000;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            animation: tooltipFade 0.3s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.top = `${rect.bottom + 8}px`;
        tooltip.style.left = `${rect.left - tooltip.offsetWidth / 2 + rect.width / 2}px`;
        
        setTimeout(() => {
            tooltip.style.animation = 'tooltipFadeOut 0.3s ease';
            setTimeout(() => tooltip.remove(), 300);
        }, 3000);
    }

    handleFieldFocus(field) {
        field.classList.remove('invalid', 'valid');
        const statusEl = field.closest('.form-group').querySelector('.field-status');
        if (statusEl) {
            statusEl.classList.remove('show');
        }
    }

    validateField(field, type) {
        const value = field.value.trim();
        const statusEl = field.closest('.form-group').querySelector('.field-status');
        
        if (!statusEl) return false;

        let isValid = false;
        let message = '';

        switch(type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                message = isValid ? 'Valid email address ✓' : 'Please enter a valid email address';
                break;

            case 'phone':
                const countryCode = field.id === 'phone' 
                    ? this.phoneCountrySelect.value 
                    : this.emergencyPhoneCountrySelect.value;
                const digits = value.replace(/\D/g, '');
                
                if (countryCode === '+63') {
                    isValid = digits.length === 10 && digits.startsWith('9');
                    message = isValid ? 'Valid Philippine mobile number ✓' : 'Enter 10 digits starting with 9';
                } else {
                    isValid = digits.length >= 7 && digits.length <= 15;
                    message = isValid ? 'Valid phone number ✓' : 'Enter a valid phone number';
                }
                break;

            case 'text':
                isValid = value.length >= 2;
                message = isValid ? 'Name confirmed ✓' : 'Please enter a valid name';
                break;
        }

        if (value === '') {
            field.classList.remove('valid', 'invalid');
            statusEl.classList.remove('show');
            return false;
        }

        if (isValid) {
            field.classList.remove('invalid');
            field.classList.add('valid');
            statusEl.textContent = message;
            statusEl.className = 'field-status success show';
        } else {
            field.classList.remove('valid');
            field.classList.add('invalid');
            statusEl.textContent = message;
            statusEl.className = 'field-status error show';
        }

        return isValid;
    }

    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        const countryCode = input.id === 'phone' 
            ? this.phoneCountrySelect.value 
            : this.emergencyPhoneCountrySelect.value;
        
        // Format based on country code
        if (countryCode === '+63') {
            // Philippine format: XXX XXX XXXX
            if (value.length <= 3) {
                input.value = value;
            } else if (value.length <= 6) {
                input.value = `${value.substring(0, 3)} ${value.substring(3)}`;
            } else {
                input.value = `${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6, 10)}`;
            }
        } else {
            // Generic international format
            input.value = value;
        }
    }

    validatePhone(phone, countryCode = '+63') {
        const digits = phone.replace(/\D/g, '');
        
        // Validation based on country code
        if (countryCode === '+63') {
            // Philippine numbers: 10 digits (without country code)
            return digits.length === 10 && digits.startsWith('9');
        } else {
            // Generic validation: 7-15 digits
            return digits.length >= 7 && digits.length <= 15;
        }
    }

    getFullPhoneNumber(input, countrySelect) {
        const countryCode = countrySelect.value;
        const digits = input.value.replace(/\D/g, '');
        return `${countryCode} ${digits}`;
    }

    validateForm() {
        const emailValid = this.validateEmail(this.emailInput.value);
        const phoneValid = this.validatePhone(this.phoneInput.value, this.phoneCountrySelect.value);
        const emergencyNameValid = this.emergencyNameInput.value.trim().length >= 2;
        const emergencyPhoneValid = this.validatePhone(this.emergencyPhoneInput.value, this.emergencyPhoneCountrySelect.value);
        
        const isValid = emailValid && phoneValid && emergencyNameValid && emergencyPhoneValid;
        
        // Update button state
        this.continueBtn.disabled = !isValid;
        
        // Update button text
        const btnText = this.continueBtn.querySelector('.btn-text');
        if (btnText) {
            if (!emailValid) {
                btnText.textContent = 'Enter valid email';
            } else if (!phoneValid) {
                btnText.textContent = 'Enter valid phone';
            } else if (!emergencyNameValid) {
                btnText.textContent = 'Enter emergency contact';
            } else if (!emergencyPhoneValid) {
                btnText.textContent = 'Enter emergency phone';
            } else {
                btnText.textContent = 'Continue to Health Info';
            }
        }
        
        return isValid;
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    }

    handleContinue() {
        if (this.validateForm()) {
            // Final validation on all fields
            const emailValid = this.validateField(this.emailInput, 'email');
            const phoneValid = this.validateField(this.phoneInput, 'phone');
            const nameValid = this.validateField(this.emergencyNameInput, 'text');
            const emergencyPhoneValid = this.validateField(this.emergencyPhoneInput, 'phone');

            if (!emailValid || !phoneValid || !nameValid || !emergencyPhoneValid) {
                this.showMessage('Please fix the errors before continuing', 'error');
                return;
            }

            // Show loading state
            this.continueBtn.disabled = true;
            const btnText = this.continueBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            btnText.textContent = 'Processing...';
            
            // Get form data
            const contactData = {
                email: this.emailInput.value.trim(),
                phone: this.getFullPhoneNumber(this.phoneInput, this.phoneCountrySelect),
                phoneCountry: this.phoneCountrySelect.value,
                emergencyName: this.emergencyNameInput.value.trim(),
                emergencyPhone: this.getFullPhoneNumber(this.emergencyPhoneInput, this.emergencyPhoneCountrySelect),
                emergencyPhoneCountry: this.emergencyPhoneCountrySelect.value,
                timestamp: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem('contactFormData', JSON.stringify(contactData));
            
            // Simulate processing
            setTimeout(() => {
                this.showMessage('Contact information saved! Moving to health questionnaire...', 'success');
                
                // Navigate to step 3
                setTimeout(() => {
                    window.location.href = 'schedule-donation-step3.html';
                }, 1500);
            }, 800);
        }
    }

    handlePrevious() {
        // Auto-save current progress
        this.autoSave();
        
        // Show confirmation
        const hasData = this.emailInput.value || this.phoneInput.value || 
                       this.emergencyNameInput.value || this.emergencyPhoneInput.value;
        
        if (hasData) {
            const confirm = window.confirm('Your progress has been saved. Go back to Step 1?');
            if (confirm) {
                window.location.href = 'schedule-donation.html';
            }
        } else {
            window.location.href = 'schedule-donation.html';
        }
    }

    autoSave() {
        const contactData = {
            email: this.emailInput.value.trim(),
            phone: this.phoneInput.value.trim(),
            phoneCountry: this.phoneCountrySelect.value,
            emergencyName: this.emergencyNameInput.value.trim(),
            emergencyPhone: this.emergencyPhoneInput.value.trim(),
            emergencyPhoneCountry: this.emergencyPhoneCountrySelect.value,
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem('contactFormData', JSON.stringify(contactData));
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        
        let bgColor = '#457B9D';
        if (type === 'success') bgColor = '#16A34A';
        if (type === 'error') bgColor = '#DC3545';
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${bgColor};
            color: white;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    document.body.removeChild(messageDiv);
                }
            }, 300);
        }, 3000);
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes tooltipFade {
        from {
            opacity: 0;
            transform: translateY(-8px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes tooltipFadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-8px);
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ContactInfoForm();
    });
} else {
    new ContactInfoForm();
}

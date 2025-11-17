// Schedule Donation Form Module

class ScheduleDonationForm {
    constructor() {
        this.form = document.getElementById('scheduleForm');
        this.continueBtn = document.getElementById('continueBtn');
        this.saveDraftBtn = document.getElementById('saveDraftBtn');
        this.hospitalSelect = document.getElementById('hospital');
        this.dateInput = document.getElementById('preferredDate');
        this.timeSelect = document.getElementById('preferredTime');
        this.bloodTypeSelect = document.getElementById('bloodType');
        this.firstTimeCheckbox = document.getElementById('firstTime');
        
        this.init();
    }

    init() {
        // Set minimum date to tomorrow
        this.setMinDate();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initial validation check
        this.validateForm();
        
        // Load saved draft if exists
        this.loadDraft();
        
        // Setup help tooltips
        this.setupHelpTooltips();
    }

    setMinDate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 90);
        
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        this.dateInput.min = formatDate(tomorrow);
        this.dateInput.max = formatDate(maxDate);
    }

    addEventListeners() {
        // Form field changes with visual feedback
        this.hospitalSelect.addEventListener('change', (e) => {
            this.validateField(e.target, 'hospital');
            this.validateForm();
        });
        
        this.dateInput.addEventListener('change', (e) => {
            this.validateField(e.target, 'date');
            this.validateForm();
        });
        
        this.timeSelect.addEventListener('change', (e) => {
            this.validateField(e.target, 'time');
            this.validateForm();
        });
        
        this.bloodTypeSelect.addEventListener('change', (e) => {
            this.validateField(e.target, 'bloodType');
            this.updateBloodTypeInfo(e.target.value);
            this.validateForm();
        });
        
        // Real-time input feedback
        this.hospitalSelect.addEventListener('focus', (e) => this.handleFieldFocus(e.target));
        this.dateInput.addEventListener('focus', (e) => this.handleFieldFocus(e.target));
        this.timeSelect.addEventListener('focus', (e) => this.handleFieldFocus(e.target));
        this.bloodTypeSelect.addEventListener('focus', (e) => this.handleFieldFocus(e.target));
        
        // Open date picker when clicking anywhere on the date input
        this.dateInput.addEventListener('click', function() {
            try {
                this.showPicker();
            } catch (e) {
                // Fallback for browsers that don't support showPicker()
                this.focus();
            }
        });
        
        // Continue button click
        this.continueBtn.addEventListener('click', () => this.handleContinue());
        
        // Save draft button
        this.saveDraftBtn.addEventListener('click', () => this.saveDraft());
        
        // Auto-save on form changes (debounced)
        let autoSaveTimeout;
        this.form.addEventListener('input', () => {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => this.autoSave(), 2000);
        });
    }
    
    handleFieldFocus(field) {
        field.classList.remove('invalid', 'valid');
        const statusEl = field.closest('.form-group').querySelector('.field-status');
        if (statusEl) {
            statusEl.classList.remove('show');
        }
    }
    
    validateField(field, fieldType) {
        const value = field.value;
        const statusEl = field.closest('.form-group').querySelector('.field-status');
        
        if (!statusEl) return;
        
        if (value) {
            field.classList.remove('invalid');
            field.classList.add('valid');
            
            let message = '';
            switch(fieldType) {
                case 'hospital':
                    message = 'Hospital selected ✓';
                    break;
                case 'date':
                    const selectedDate = new Date(value);
                    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
                    message = `Appointment on ${dayName} ✓`;
                    break;
                case 'time':
                    const hour = parseInt(value.split(':')[0]);
                    const period = hour < 12 ? 'AM' : 'PM';
                    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
                    message = `${displayHour}:00 ${period} slot reserved ✓`;
                    break;
                case 'bloodType':
                    message = 'Blood type confirmed ✓';
                    break;
            }
            
            statusEl.textContent = message;
            statusEl.className = 'field-status success show';
        } else {
            field.classList.remove('valid');
            statusEl.classList.remove('show');
        }
    }
    
    updateBloodTypeInfo(bloodType) {
        const helpText = document.getElementById('bloodTypeHelp');
        if (!helpText) return;
        
        const info = {
            'O+': 'Can donate to O+, A+, B+, AB+ recipients (38% of population)',
            'O-': 'Universal donor! Can donate to all blood types (7% of population)',
            'A+': 'Can donate to A+ and AB+ recipients (34% of population)',
            'A-': 'Can donate to A+, A-, AB+, AB- (6% of population)',
            'B+': 'Can donate to B+ and AB+ recipients (9% of population)',
            'B-': 'Can donate to B+, B-, AB+, AB- (2% of population)',
            'AB+': 'Universal recipient! Can receive from all types (3% of population)',
            'AB-': 'Rarest blood type! Can receive from all negative types (1% of population)',
            'unknown': 'No worries! We can determine your blood type during donation.'
        };
        
        if (info[bloodType]) {
            helpText.textContent = info[bloodType];
            helpText.style.display = 'flex';
        } else {
            helpText.style.display = 'none';
        }
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

    validateForm() {
        const isValid = this.hospitalSelect.value !== '' && 
                       this.dateInput.value !== '' && 
                       this.timeSelect.value !== '' && 
                       this.bloodTypeSelect.value !== '';
        
        // Update button state
        this.continueBtn.disabled = !isValid;
        
        // Update button text based on state
        const btnText = this.continueBtn.querySelector('.btn-text');
        if (btnText) {
            btnText.textContent = isValid ? 'Continue to Contact Info' : 'Please complete all fields';
        }
        
        return isValid;
    }

    handleContinue() {
        if (this.validateForm()) {
            // Show loading state
            this.continueBtn.disabled = true;
            const btnText = this.continueBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;
            btnText.textContent = 'Processing...';
            
            // Get form data
            const formData = {
                hospital: this.hospitalSelect.value,
                hospitalName: this.hospitalSelect.options[this.hospitalSelect.selectedIndex].text,
                date: this.dateInput.value,
                time: this.timeSelect.value,
                timeDisplay: this.timeSelect.options[this.timeSelect.selectedIndex].text,
                bloodType: this.bloodTypeSelect.value,
                firstTime: this.firstTimeCheckbox.checked,
                timestamp: new Date().toISOString()
            };
            
            // Save to localStorage for next step
            localStorage.setItem('scheduleFormData', JSON.stringify(formData));
            localStorage.removeItem('scheduleFormDraft'); // Clear draft
            
            // Simulate processing
            setTimeout(() => {
                // Show success message
                this.showMessage('Step 1 completed! Moving to contact information...', 'success');
                
                // Navigate to step 2
                setTimeout(() => {
                    window.location.href = 'schedule-donation-step2.html';
                }, 1500);
            }, 800);
        }
    }
    
    saveDraft() {
        const formData = {
            hospital: this.hospitalSelect.value,
            date: this.dateInput.value,
            time: this.timeSelect.value,
            bloodType: this.bloodTypeSelect.value,
            firstTime: this.firstTimeCheckbox.checked,
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem('scheduleFormDraft', JSON.stringify(formData));
        this.showMessage('Draft saved! You can continue later.', 'info');
    }
    
    autoSave() {
        if (this.hospitalSelect.value || this.dateInput.value || this.timeSelect.value || this.bloodTypeSelect.value) {
            const formData = {
                hospital: this.hospitalSelect.value,
                date: this.dateInput.value,
                time: this.timeSelect.value,
                bloodType: this.bloodTypeSelect.value,
                firstTime: this.firstTimeCheckbox.checked,
                savedAt: new Date().toISOString()
            };
            
            localStorage.setItem('scheduleFormDraft', JSON.stringify(formData));
        }
    }
    
    loadDraft() {
        const draft = localStorage.getItem('scheduleFormDraft');
        if (draft) {
            try {
                const formData = JSON.parse(draft);
                
                // Show restore message
                const restore = confirm('We found a saved draft from your previous session. Would you like to restore it?');
                
                if (restore) {
                    if (formData.hospital) this.hospitalSelect.value = formData.hospital;
                    if (formData.date) this.dateInput.value = formData.date;
                    if (formData.time) this.timeSelect.value = formData.time;
                    if (formData.bloodType) this.bloodTypeSelect.value = formData.bloodType;
                    if (formData.firstTime) this.firstTimeCheckbox.checked = formData.firstTime;
                    
                    this.validateForm();
                    this.showMessage('Draft restored successfully!', 'success');
                } else {
                    localStorage.removeItem('scheduleFormDraft');
                }
            } catch (e) {
                console.error('Error loading draft:', e);
                localStorage.removeItem('scheduleFormDraft');
            }
        }
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${type === 'success' ? '#16A34A' : '#457B9D'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
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
        new ScheduleDonationForm();
    });
} else {
    new ScheduleDonationForm();
}

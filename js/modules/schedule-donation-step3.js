// Schedule Donation Step 3 - Health Information Form Module

class HealthInfoForm {
    constructor() {
        this.form = document.getElementById('healthForm');
        this.confirmBtn = document.getElementById('confirmBtn');
        this.previousBtn = document.getElementById('previousBtn');
        this.lastDonationInput = document.getElementById('lastDonation');
        this.medicalConditionsInput = document.getElementById('medicalConditions');
        this.medicationsInput = document.getElementById('medications');
        this.confirmationCheckbox = document.getElementById('confirmation');
        this.modal = document.getElementById('confirmationModal');
        
        this.init();
    }

    init() {
        // Load previous step data
        this.loadPreviousStepsData();
        
        // Set date constraints
        this.setDateConstraints();
        
        // Add event listeners
        this.addEventListeners();
        
        // Initial validation check
        this.validateForm();
        
        // Load saved health info if exists
        this.loadSavedData();
    }

    loadPreviousStepsData() {
        const step1Data = localStorage.getItem('scheduleFormData');
        const step2Data = localStorage.getItem('contactFormData');
        
        if (!step1Data || !step2Data) {
            // Redirect back to appropriate step if data missing
            this.showMessage('Please complete all previous steps', 'error');
            setTimeout(() => {
                if (!step1Data) {
                    window.location.href = 'schedule-donation.html';
                } else {
                    window.location.href = 'schedule-donation-step2.html';
                }
            }, 2000);
            return false;
        }
        
        return true;
    }

    setDateConstraints() {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() - 56); // 8 weeks ago
        
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        this.lastDonationInput.max = formatDate(today);
    }

    addEventListeners() {
        // Last donation date
        this.lastDonationInput.addEventListener('change', (e) => {
            this.validateLastDonationDate(e.target);
            this.validateForm();
        });

        // Open date picker when clicking anywhere on the input
        this.lastDonationInput.addEventListener('click', function() {
            try {
                this.showPicker();
            } catch (e) {
                // Fallback for browsers that don't support showPicker()
                this.focus();
            }
        });

        // Text areas - character count and validation
        this.medicalConditionsInput.addEventListener('input', () => {
            this.validateForm();
        });

        this.medicationsInput.addEventListener('input', () => {
            this.validateForm();
        });

        // Confirmation checkbox (required)
        this.confirmationCheckbox.addEventListener('change', () => {
            this.validateForm();
        });

        // Button handlers
        this.confirmBtn.addEventListener('click', () => this.handleConfirm());
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
            this.handleConfirm();
        });
        
        // Setup help tooltips
        this.setupHelpTooltips();

        // Modal button handlers
        document.getElementById('cancelConfirmBtn')?.addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('finalConfirmBtn')?.addEventListener('click', () => {
            this.processFinalConfirmation();
        });

        // Close modal on overlay click
        const modalOverlay = document.querySelector('.modal-overlay');
        modalOverlay?.addEventListener('click', () => {
            this.closeModal();
        });
    }

    validateLastDonationDate(input) {
        const value = input.value;
        const statusEl = input.closest('.form-group').querySelector('.field-status');
        
        if (!statusEl || !value) {
            if (statusEl) statusEl.classList.remove('show');
            input.classList.remove('valid', 'invalid');
            return true;
        }

        const selectedDate = new Date(value);
        const today = new Date();
        const eightWeeksAgo = new Date();
        eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

        // Check if date is in future
        if (selectedDate > today) {
            input.classList.remove('valid');
            input.classList.add('invalid');
            statusEl.textContent = 'Date cannot be in the future';
            statusEl.className = 'field-status error show';
            return false;
        }

        // Check if enough time has passed (8 weeks)
        if (selectedDate > eightWeeksAgo) {
            input.classList.remove('valid');
            input.classList.add('invalid');
            const daysUntilEligible = Math.ceil((selectedDate - eightWeeksAgo) / (1000 * 60 * 60 * 24));
            statusEl.textContent = `You must wait ${daysUntilEligible} more days before donating again`;
            statusEl.className = 'field-status error show';
            return false;
        }

        // Valid date
        input.classList.remove('invalid');
        input.classList.add('valid');
        statusEl.textContent = 'Eligible to donate ✓';
        statusEl.className = 'field-status success show';
        return true;
    }

    validateForm() {
        // Checkbox must be checked
        const isConfirmed = this.confirmationCheckbox.checked;
        
        // Check last donation date if provided
        let isDateValid = true;
        if (this.lastDonationInput.value) {
            isDateValid = this.validateLastDonationDate(this.lastDonationInput);
        }
        
        const isValid = isConfirmed && isDateValid;
        
        // Update button state
        this.confirmBtn.disabled = !isValid;
        
        // Update button text
        const btnText = this.confirmBtn.querySelector('.btn-text');
        if (btnText) {
            if (!isConfirmed) {
                btnText.textContent = 'Please confirm eligibility';
            } else if (!isDateValid) {
                btnText.textContent = 'Check donation date';
            } else {
                btnText.textContent = 'Confirm Appointment';
            }
        }
        
        return isValid;
    }

    handleConfirm() {
        if (!this.validateForm()) {
            this.showMessage('Please complete all required fields', 'error');
            return;
        }

        // Save health data
        const healthData = {
            lastDonation: this.lastDonationInput.value || null,
            medicalConditions: this.medicalConditionsInput.value.trim() || null,
            medications: this.medicationsInput.value.trim() || null,
            confirmed: this.confirmationCheckbox.checked,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('healthFormData', JSON.stringify(healthData));

        // Get all step data for preview
        const step1Data = JSON.parse(localStorage.getItem('scheduleFormData') || '{}');
        const step2Data = JSON.parse(localStorage.getItem('contactFormData') || '{}');

        // Show confirmation modal with details
        this.showConfirmationModal({
            ...step1Data,
            ...step2Data,
            ...healthData
        });
    }

    showConfirmationModal(appointmentData) {
        // Format date
        const formatDate = (dateString) => {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        };

        // Populate modal fields
        document.getElementById('modalDate').textContent = formatDate(appointmentData.date);
        document.getElementById('modalTime').textContent = appointmentData.time || '-';
        document.getElementById('modalLocation').textContent = appointmentData.hospitalName || appointmentData.hospital || '-';
        document.getElementById('modalBloodType').textContent = appointmentData.bloodType || '-';
        document.getElementById('modalEmail').textContent = appointmentData.email || '-';

        // Show modal
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    processFinalConfirmation() {
        const finalConfirmBtn = document.getElementById('finalConfirmBtn');
        finalConfirmBtn.disabled = true;
        finalConfirmBtn.textContent = 'Processing...';

        // Get all step data
        const step1Data = JSON.parse(localStorage.getItem('scheduleFormData') || '{}');
        const step2Data = JSON.parse(localStorage.getItem('contactFormData') || '{}');
        const healthData = JSON.parse(localStorage.getItem('healthFormData') || '{}');

        // Create complete appointment
        const appointment = {
            id: 'APT-' + Date.now(),
            ...step1Data,
            ...step2Data,
            ...healthData,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        // Save appointment to localStorage (in real app, this would be sent to server)
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        appointments.push(appointment);
        localStorage.setItem('appointments', JSON.stringify(appointments));
        
        console.log('Appointment created:', appointment);

        // Simulate API call delay
        setTimeout(() => {
            // Redirect to confirmation page
            window.location.href = 'schedule-donation-confirmation.html';
        }, 800);
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    handlePrevious() {
        // Auto-save current progress
        this.autoSave();
        
        // Show confirmation
        const hasData = this.lastDonationInput.value || 
                       this.medicalConditionsInput.value || 
                       this.medicationsInput.value ||
                       this.confirmationCheckbox.checked;
        
        if (hasData) {
            const confirm = window.confirm('Your progress has been saved. Go back to Step 2?');
            if (confirm) {
                window.location.href = 'schedule-donation-step2.html';
            }
        } else {
            window.location.href = 'schedule-donation-step2.html';
        }
    }

    autoSave() {
        const healthData = {
            lastDonation: this.lastDonationInput.value || null,
            medicalConditions: this.medicalConditionsInput.value.trim() || null,
            medications: this.medicationsInput.value.trim() || null,
            confirmed: this.confirmationCheckbox.checked,
            savedAt: new Date().toISOString()
        };
        
        localStorage.setItem('healthFormData', JSON.stringify(healthData));
    }

    loadSavedData() {
        const savedData = localStorage.getItem('healthFormData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                
                if (data.lastDonation) {
                    this.lastDonationInput.value = data.lastDonation;
                    setTimeout(() => {
                        this.validateLastDonationDate(this.lastDonationInput);
                    }, 100);
                }
                if (data.medicalConditions) this.medicalConditionsInput.value = data.medicalConditions;
                if (data.medications) this.medicationsInput.value = data.medications;
                if (data.confirmed) this.confirmationCheckbox.checked = data.confirmed;
                
                this.validateForm();
            } catch (e) {
                console.error('Error loading saved data:', e);
            }
        }
    }

    clearAllData() {
        // Clear all form data from localStorage
        localStorage.removeItem('scheduleFormData');
        localStorage.removeItem('contactFormData');
        localStorage.removeItem('healthFormData');
        localStorage.removeItem('scheduleFormDraft');
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
        new HealthInfoForm();
    });
} else {
    new HealthInfoForm();
}

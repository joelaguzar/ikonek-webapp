/**
 * Edit Profile Page Module
 * Handles form validation, autosave, and profile updates
 */

class EditProfileManager {
    constructor() {
        this.form = null;
        this.originalData = {};
        this.hasUnsavedChanges = false;
        this.autoSaveTimer = null;
        this.validationRules = {};
        this.init();
    }

    init() {
        this.form = document.getElementById('editProfileForm');
        if (!this.form) return;

        this.setupValidationRules();
        this.loadUserData();
        this.setupEventListeners();
        this.setupFormTracking();
        this.setupAvatarUpload();
        this.preventUnload();
    }

    /**
     * Setup validation rules
     */
    setupValidationRules() {
        this.validationRules = {
            firstName: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s'-]+$/,
                message: 'First name must be 2-50 characters and contain only letters'
            },
            lastName: {
                required: true,
                minLength: 2,
                maxLength: 50,
                pattern: /^[a-zA-Z\s'-]+$/,
                message: 'Last name must be 2-50 characters and contain only letters'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            phone: {
                required: true,
                pattern: /^\+63\s\d{3}\s\d{3}\s\d{4}$/,
                message: 'Phone must be in format: +63 XXX XXX XXXX'
            },
            dateOfBirth: {
                required: true,
                custom: (value) => {
                    const age = this.calculateAge(value);
                    return age >= 18 && age <= 65;
                },
                message: 'You must be between 18 and 65 years old'
            },
            bloodType: {
                required: true,
                message: 'Please select your blood type'
            },
            address: {
                required: true,
                minLength: 10,
                message: 'Please enter your complete address'
            },
            emergencyName: {
                required: true,
                minLength: 2,
                message: 'Emergency contact name is required'
            },
            emergencyPhone: {
                required: true,
                pattern: /^\+63\s\d{3}\s\d{3}\s\d{4}$/,
                message: 'Phone must be in format: +63 XXX XXX XXXX'
            }
        };
    }

    /**
     * Load user data
     */
    loadUserData() {
        const userData = this.getUserData();
        this.originalData = { ...userData };
        this.populateForm(userData);
    }

    /**
     * Get user data from localStorage
     */
    getUserData() {
        const defaultData = {
            firstName: 'Priya',
            middleName: 'Santos',
            lastName: 'Reyes',
            dateOfBirth: '1995-06-15',
            bloodType: 'O_POSITIVE',
            gender: 'female',
            weight: '',
            email: 'priya.reyes@email.com',
            phone: '+63 912 345 6789',
            alternatePhone: '',
            address: 'Quezon City, Metro Manila',
            city: 'Quezon City',
            province: 'Metro Manila',
            emergencyName: 'Maria Reyes',
            emergencyRelationship: 'parent',
            emergencyPhone: '+63 917 123 4567',
            emergencyEmail: '',
            conditions: [],
            allergies: '',
            medications: ''
        };

        const stored = localStorage.getItem('userData');
        return stored ? { ...defaultData, ...JSON.parse(stored) } : defaultData;
    }

    /**
     * Populate form with data
     */
    populateForm(data) {
        Object.keys(data).forEach(key => {
            const element = this.form.elements[key];
            if (element) {
                if (element.type === 'checkbox') {
                    if (Array.isArray(data[key])) {
                        const checkboxes = this.form.querySelectorAll(`[name="${key}"]`);
                        checkboxes.forEach(cb => {
                            cb.checked = data[key].includes(cb.value);
                        });
                    }
                } else {
                    element.value = data[key] || '';
                }
            }
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Cancel button
        document.getElementById('cancelBtn')?.addEventListener('click', () => this.handleCancel());

        // Reset button
        document.getElementById('resetBtn')?.addEventListener('click', () => this.handleReset());

        // Real-time validation on blur
        this.form.querySelectorAll('.form-input').forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', (e) => {
                this.clearError(e.target);
                this.markAsChanged();
            });
        });

        // Phone number formatting
        this.setupPhoneFormatting();

        // Logout button
        document.querySelector('.logout-btn')?.addEventListener('click', () => this.handleLogout());

        // Medical conditions - "None" checkbox logic
        this.setupMedicalConditionsLogic();
    }

    /**
     * Setup phone number formatting
     */
    setupPhoneFormatting() {
        const phoneFields = ['phone', 'alternatePhone', 'emergencyPhone'];
        phoneFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', (e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    
                    if (value.startsWith('63')) {
                        value = value.substring(2);
                    }
                    
                    if (value.length > 0) {
                        if (value.length <= 3) {
                            e.target.value = `+63 ${value}`;
                        } else if (value.length <= 6) {
                            e.target.value = `+63 ${value.substring(0, 3)} ${value.substring(3)}`;
                        } else {
                            e.target.value = `+63 ${value.substring(0, 3)} ${value.substring(3, 6)} ${value.substring(6, 10)}`;
                        }
                    }
                });
            }
        });
    }

    /**
     * Setup medical conditions logic
     */
    setupMedicalConditionsLogic() {
        const checkboxes = this.form.querySelectorAll('[name="conditions"]');
        const noneCheckbox = Array.from(checkboxes).find(cb => cb.value === 'none');

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                if (checkbox.value === 'none' && checkbox.checked) {
                    checkboxes.forEach(cb => {
                        if (cb.value !== 'none') cb.checked = false;
                    });
                } else if (checkbox.value !== 'none' && checkbox.checked) {
                    if (noneCheckbox) noneCheckbox.checked = false;
                }
            });
        });
    }

    /**
     * Setup form change tracking
     */
    setupFormTracking() {
        this.form.addEventListener('change', () => this.markAsChanged());
    }

    /**
     * Mark form as changed
     */
    markAsChanged() {
        this.hasUnsavedChanges = true;
        this.scheduleAutoSave();
        this.updateSaveStatus('unsaved');
    }

    /**
     * Schedule auto-save
     */
    scheduleAutoSave() {
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }

        this.autoSaveTimer = setTimeout(() => {
            this.autoSave();
        }, 2000);
    }

    /**
     * Auto-save draft
     */
    autoSave() {
        if (!this.hasUnsavedChanges) return;

        const formData = this.getFormData();
        localStorage.setItem('userDataDraft', JSON.stringify(formData));
        this.updateSaveStatus('saved');
        
        console.log('Draft auto-saved');
    }

    /**
     * Validate field
     */
    validateField(field) {
        const name = field.name || field.id;
        const value = field.value.trim();
        const rules = this.validationRules[name];

        if (!rules) return true;

        // Clear previous error
        this.clearError(field);

        // Required check
        if (rules.required && !value) {
            this.showError(field, `${this.getFieldLabel(field)} is required`);
            return false;
        }

        // Min length check
        if (rules.minLength && value.length < rules.minLength) {
            this.showError(field, rules.message);
            return false;
        }

        // Max length check
        if (rules.maxLength && value.length > rules.maxLength) {
            this.showError(field, rules.message);
            return false;
        }

        // Pattern check
        if (rules.pattern && value && !rules.pattern.test(value)) {
            this.showError(field, rules.message);
            return false;
        }

        // Custom validation
        if (rules.custom && value && !rules.custom(value)) {
            this.showError(field, rules.message);
            return false;
        }

        // Show success
        field.classList.add('success');
        return true;
    }

    /**
     * Show error
     */
    showError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        const errorId = `${field.id}Error`;
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('visible');
        }
    }

    /**
     * Clear error
     */
    clearError(field) {
        field.classList.remove('error', 'success');
        
        const errorId = `${field.id}Error`;
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('visible');
        }
    }

    /**
     * Get field label
     */
    getFieldLabel(field) {
        const label = this.form.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }

    /**
     * Validate entire form
     */
    validateForm() {
        let isValid = true;
        const fields = this.form.querySelectorAll('.form-input[required]');

        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Get form data
     */
    getFormData() {
        const formData = new FormData(this.form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            if (key === 'conditions') {
                if (!data.conditions) data.conditions = [];
                data.conditions.push(value);
            } else {
                data[key] = value;
            }
        }

        return data;
    }

    /**
     * Handle form submission
     */
    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            this.showNotification('Please fix the errors before saving', 'error');
            this.scrollToFirstError();
            return;
        }

        const saveBtn = document.getElementById('saveBtn');
        const originalText = saveBtn.innerHTML;
        saveBtn.disabled = true;
        saveBtn.innerHTML = `
            <svg class="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor"/>
            </svg>
            Saving...
        `;

        try {
            await this.saveProfile();
            
            this.hasUnsavedChanges = false;
            this.updateSaveStatus('saved');
            this.showNotification('Profile updated successfully!', 'success');
            
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);
        } catch (error) {
            this.showNotification('Failed to save profile. Please try again.', 'error');
            console.error('Save error:', error);
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = originalText;
        }
    }

    /**
     * Save profile
     */
    async saveProfile() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const formData = this.getFormData();
                localStorage.setItem('userData', JSON.stringify(formData));
                localStorage.removeItem('userDataDraft');
                this.originalData = { ...formData };
                resolve();
            }, 1000);
        });
    }

    /**
     * Handle cancel
     */
    handleCancel() {
        if (this.hasUnsavedChanges) {
            if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
                window.location.href = 'profile.html';
            }
        } else {
            window.location.href = 'profile.html';
        }
    }

    /**
     * Handle reset
     */
    handleReset() {
        if (confirm('Are you sure you want to reset all changes?')) {
            this.populateForm(this.originalData);
            this.hasUnsavedChanges = false;
            this.form.querySelectorAll('.form-input').forEach(input => {
                this.clearError(input);
            });
            this.showNotification('Changes reset', 'info');
        }
    }

    /**
     * Update save status
     */
    updateSaveStatus(status) {
        const statusElement = document.getElementById('saveStatus');
        if (!statusElement) return;

        if (status === 'saved') {
            statusElement.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#28A745" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                All changes saved
            `;
            statusElement.classList.remove('error');
            statusElement.classList.add('visible');
        } else if (status === 'unsaved') {
            statusElement.textContent = 'Unsaved changes';
            statusElement.classList.add('error');
            statusElement.classList.add('visible');
        }
    }

    /**
     * Scroll to first error
     */
    scrollToFirstError() {
        const firstError = this.form.querySelector('.form-input.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }

    /**
     * Calculate age
     */
    calculateAge(dateOfBirth) {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    /**
     * Setup avatar upload
     */
    setupAvatarUpload() {
        const uploadBtn = document.getElementById('uploadAvatarBtn');
        const removeBtn = document.getElementById('removeAvatarBtn');
        const input = document.getElementById('avatarInput');
        const preview = document.getElementById('avatarPreview');

        uploadBtn?.addEventListener('click', () => input.click());

        input?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    this.showNotification('Image size must be less than 5MB', 'error');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.style.backgroundImage = `url(${e.target.result})`;
                    preview.textContent = '';
                    this.markAsChanged();
                };
                reader.readAsDataURL(file);
            }
        });

        removeBtn?.addEventListener('click', () => {
            preview.style.backgroundImage = '';
            preview.textContent = 'PR';
            input.value = '';
            this.markAsChanged();
        });
    }

    /**
     * Prevent accidental page unload
     */
    preventUnload() {
        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    /**
     * Handle logout
     */
    handleLogout() {
        if (this.hasUnsavedChanges) {
            if (!confirm('You have unsaved changes. Are you sure you want to logout?')) {
                return;
            }
        }

        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `edit-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: white;
            border-left: 4px solid ${type === 'success' ? '#28A745' : type === 'error' ? '#DC3545' : '#E63946'};
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 500;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .spin { animation: spin 1s linear infinite; }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new EditProfileManager();
});

export default EditProfileManager;

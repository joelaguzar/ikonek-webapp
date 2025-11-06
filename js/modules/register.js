/* ============================================
   Register Form Module
   Handles registration form validation and submission
   ============================================ */

// Form elements
const registerForm = document.getElementById('registerForm');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

// Form validation patterns
const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^(\+63\s?|0)?9\d{2}\s?\d{3}\s?\d{4}$/,
    password: /^.{8,}$/,
    name: /^[a-zA-Z\s'-]{2,}$/
};

// Error messages
const errorMessages = {
    firstName: 'Please enter a valid first name',
    lastName: 'Please enter a valid last name',
    email: 'Please enter a valid email address',
    contactNumber: 'Please enter a valid Philippine phone number',
    password: 'Password must be at least 8 characters long',
    birthdate: 'Please select your birthdate',
    sex: 'Please select your sex',
    bloodType: 'Please select your blood type',
    required: 'This field is required'
};

// Initialize
function init() {
    setupPasswordToggle();
    setupFormValidation();
    setupFormSubmission();
}

// Password visibility toggle
function setupPasswordToggle() {
    if (!togglePassword || !passwordInput) return;

    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;

        // Toggle eye icons
        const eyeOff = togglePassword.querySelector('.eye-off');
        const eyeOn = togglePassword.querySelector('.eye-on');
        
        if (eyeOff && eyeOn) {
            eyeOff.style.display = type === 'password' ? 'block' : 'none';
            eyeOn.style.display = type === 'text' ? 'block' : 'none';
        }
    });
}

// Real-time validation
function setupFormValidation() {
    const inputs = registerForm.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', () => {
            validateField(input);
        });

        // Clear error on input
        input.addEventListener('input', () => {
            clearError(input);
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    const errorElement = document.getElementById(`${field.id}-error`);

    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showError(field, errorElement, errorMessages.required);
        return false;
    }

    // Skip validation if field is optional and empty
    if (!field.hasAttribute('required') && !value) {
        return true;
    }

    // Validate based on field type
    switch (fieldName) {
        case 'firstName':
        case 'lastName':
            if (!patterns.name.test(value)) {
                showError(field, errorElement, errorMessages[fieldName]);
                return false;
            }
            break;

        case 'email':
            if (!patterns.email.test(value)) {
                showError(field, errorElement, errorMessages.email);
                return false;
            }
            break;

        case 'contactNumber':
            // Remove spaces and special characters for validation
            const phoneDigits = value.replace(/[\s\-()]/g, '');
            const phonePattern = /^(\+63|0)?9\d{9}$/;
            
            if (!phonePattern.test(phoneDigits)) {
                // Provide more specific error message
                const digitsOnly = phoneDigits.replace(/\D/g, '');
                let errorMsg = errorMessages.contactNumber;
                
                if (phoneDigits.startsWith('+63')) {
                    const afterCode = phoneDigits.substring(3);
                    if (!afterCode.startsWith('9')) {
                        errorMsg = 'Mobile number must start with 9 (e.g., +63 912 345 6789)';
                    } else if (afterCode.length !== 10) {
                        errorMsg = `Mobile number must have 10 digits after +63 (currently ${afterCode.length})`;
                    }
                } else if (phoneDigits.startsWith('0')) {
                    if (phoneDigits.length !== 11) {
                        errorMsg = `Number must have 11 digits with 0 (currently ${phoneDigits.length})`;
                    }
                } else if (phoneDigits.startsWith('9')) {
                    if (phoneDigits.length !== 10) {
                        errorMsg = `Mobile number must have 10 digits (currently ${phoneDigits.length})`;
                    }
                }
                
                showError(field, errorElement, errorMsg);
                return false;
            }
            break;

        case 'password':
            if (!patterns.password.test(value)) {
                showError(field, errorElement, errorMessages.password);
                return false;
            }
            break;

        case 'birthdate':
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            
            if (age < 18) {
                showError(field, errorElement, 'You must be at least 18 years old');
                return false;
            }
            if (age > 120) {
                showError(field, errorElement, 'Please enter a valid birthdate');
                return false;
            }
            break;

        case 'sex':
        case 'bloodType':
            if (!value) {
                showError(field, errorElement, errorMessages[fieldName]);
                return false;
            }
            break;
    }

    clearError(field);
    return true;
}

// Show error message
function showError(field, errorElement, message) {
    field.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('active');
    }
}

// Clear error message
function clearError(field) {
    field.classList.remove('error');
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('active');
    }
}

// Form submission
function setupFormSubmission() {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        const inputs = registerForm.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            // Focus on first error field
            const firstError = registerForm.querySelector('.error');
            if (firstError) {
                firstError.focus();
            }
            return;
        }

        // Get form data
        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData.entries());

        // Submit form
        await handleRegistration(data);
    });
}

// Handle registration
async function handleRegistration(data) {
    const submitButton = registerForm.querySelector('.btn-register');
    
    try {
        // Add loading state
        submitButton.disabled = true;
        submitButton.classList.add('loading');

        // TODO: Replace with actual API call
        console.log('Registration data:', data);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success
        showSuccessMessage();
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        console.error('Registration error:', error);
        showErrorMessage('Registration failed. Please try again.');
        
    } finally {
        // Remove loading state
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }
}

// Show success message
function showSuccessMessage() {
    // TODO: Implement a better notification system
    alert('Registration successful! Redirecting to login...');
}

// Show error message
function showErrorMessage(message) {
    // TODO: Implement a better notification system
    alert(message);
}

// Format phone number as user types
function formatPhoneNumber(input) {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.startsWith('63')) {
            value = '+' + value;
        } else if (value.startsWith('9') && value.length === 10) {
            value = '+63 ' + value;
        }
        
        // Format: +63 912 345 6789
        if (value.startsWith('+63')) {
            value = value.substring(0, 3) + ' ' + 
                    value.substring(3, 6) + ' ' + 
                    value.substring(6, 9) + ' ' + 
                    value.substring(9, 13);
        }
        
        e.target.value = value.trim();
    });
}

// Apply phone number formatting
const phoneInput = document.getElementById('contactNumber');
if (phoneInput) {
    formatPhoneNumber(phoneInput);
}

// Initialize the module
document.addEventListener('DOMContentLoaded', init);

export { validateField, showError, clearError };

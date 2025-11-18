/**
 * Profile Page Module
 * Handles profile page functionality and interactions
 */

class ProfileManager {
    constructor() {
        this.isEditing = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setActiveNavigation();
        this.loadUserProfile();
        this.animateStats();
        this.setupTooltips();
        this.setupAvatarUploadHandler();
        this.loadSavedAvatar();
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Edit Profile button
        const editProfileBtn = document.querySelector('.btn-edit-profile');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', () => this.handleEditProfile());
        }

        // Settings button
        const settingsBtn = document.querySelector('.btn-icon');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => this.handleSettings());
        }

        // Avatar upload button
        const avatarUploadBtn = document.querySelector('.avatar-upload-btn');
        if (avatarUploadBtn) {
            avatarUploadBtn.addEventListener('click', () => this.handleAvatarUpload());
        }

        // Profile action items
        const actionItems = document.querySelectorAll('.profile-action-item');
        actionItems.forEach((item, index) => {
            item.addEventListener('click', () => this.handleActionClick(index));
        });

        // Logout button
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Add hover effects to profile cards
        this.setupCardHoverEffects();
    }

    /**
     * Set up card hover effects
     */
    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.profile-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px)';
            });
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    /**
     * Animate stats on page load
     */
    animateStats() {
        const statValues = document.querySelectorAll('.stat-banner-value');
        statValues.forEach(stat => {
            if (!stat.classList.contains('verified-badge')) {
                const finalValue = parseInt(stat.textContent);
                let currentValue = 0;
                const increment = Math.ceil(finalValue / 30);
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        stat.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        stat.textContent = currentValue;
                    }
                }, 40);
            }
        });
    }

    /**
     * Setup tooltips for achievement badges
     */
    setupTooltips() {
        const badges = document.querySelectorAll('.achievement-badge');
        badges.forEach(badge => {
            badge.addEventListener('mouseenter', function() {
                const tooltip = this.getAttribute('title');
                if (tooltip) {
                    this.style.position = 'relative';
                    // Tooltip functionality can be enhanced with a custom tooltip element
                }
            });
        });
    }

    /**
     * Set active navigation item
     */
    setActiveNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('href') === 'profile.html') {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * Load user profile data
     */
    loadUserProfile() {
        const userData = this.getUserData();
        this.updateProfileUI(userData);
        this.calculateAndDisplayAge(userData.dateOfBirth);
    }

    /**
     * Get user data from localStorage
     */
    getUserData() {
        const defaultUser = {
            firstName: 'Priya',
            middleName: 'Santos',
            lastName: 'Reyes',
            dateOfBirth: 'June 15, 1995',
            bloodType: 'O POSITIVE',
            email: 'priya.reyes@email.com',
            phone: '+63 912 345 6789',
            address: 'Quezon City, Metro Manila',
            emergencyContactName: 'Maria Reyes',
            emergencyContactPhone: '+63 917 123 4567',
            emergencyContactRelationship: 'Mother',
            memberSince: 'January 2023',
            totalDonations: 12,
            livesSaved: 36,
            yearsActive: 2,
            avatar: 'PR',
            verified: true
        };

        const storedUser = localStorage.getItem('userData');
        return storedUser ? JSON.parse(storedUser) : defaultUser;
    }

    /**
     * Update profile UI with user data
     */
    updateProfileUI(userData) {
        console.log('Profile data loaded:', userData);
        
        // Show loading state briefly
        const valueWrappers = document.querySelectorAll('.profile-field-value-wrapper');
        valueWrappers.forEach(wrapper => {
            wrapper.classList.add('loading');
        });

        setTimeout(() => {
            valueWrappers.forEach(wrapper => {
                wrapper.classList.remove('loading');
            });
        }, 500);
    }

    /**
     * Calculate and display age from date of birth
     */
    calculateAndDisplayAge(dateOfBirth) {
        const age = this.calculateAge(dateOfBirth);
        const metaElement = document.querySelector('.profile-field-meta');
        if (metaElement && metaElement.textContent.includes('years old')) {
            metaElement.textContent = `(${age} years old)`;
        }
    }

    /**
     * Handle edit profile action
     */
    handleEditProfile() {
        window.location.href = 'edit-profile.html';
    }

    /**
     * Handle settings action
     */
    handleSettings() {
        this.showNotification('Settings panel coming soon!', 'info');
    }

    /**
     * Handle avatar upload
     */
    handleAvatarUpload() {
        const fileInput = document.getElementById('avatarInput');
        if (fileInput) {
            fileInput.click();
        }
    }

    /**
     * Setup avatar upload functionality
     */
    setupAvatarUploadHandler() {
        const fileInput = document.getElementById('avatarInput');
        const avatarElement = document.getElementById('profileAvatar');
        const sidebarAvatar = document.querySelector('.user-avatar');
        
        if (!fileInput || !avatarElement) return;

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showNotification('Please select a valid image file', 'error');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.showNotification('Image size must be less than 5MB', 'error');
                return;
            }

            // Read and display the image
            const reader = new FileReader();
            reader.onload = (event) => {
                const imageUrl = event.target.result;
                
                // Update main avatar
                avatarElement.style.backgroundImage = `url(${imageUrl})`;
                avatarElement.style.backgroundSize = 'cover';
                avatarElement.style.backgroundPosition = 'center';
                avatarElement.textContent = '';
                
                // Update sidebar avatar
                if (sidebarAvatar) {
                    sidebarAvatar.style.backgroundImage = `url(${imageUrl})`;
                    sidebarAvatar.style.backgroundSize = 'cover';
                    sidebarAvatar.style.backgroundPosition = 'center';
                    sidebarAvatar.textContent = '';
                }
                
                // Save to localStorage
                localStorage.setItem('userAvatar', imageUrl);
                
                this.showNotification('Avatar updated successfully!', 'success');
            };
            
            reader.onerror = () => {
                this.showNotification('Failed to read image file', 'error');
            };
            
            reader.readAsDataURL(file);
        });
    }

    /**
     * Load saved avatar from localStorage
     */
    loadSavedAvatar() {
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) {
            const avatarElement = document.getElementById('profileAvatar');
            const sidebarAvatar = document.querySelector('.user-avatar');
            
            if (avatarElement) {
                avatarElement.style.backgroundImage = `url(${savedAvatar})`;
                avatarElement.style.backgroundSize = 'cover';
                avatarElement.style.backgroundPosition = 'center';
                avatarElement.textContent = '';
            }
            
            if (sidebarAvatar) {
                sidebarAvatar.style.backgroundImage = `url(${savedAvatar})`;
                sidebarAvatar.style.backgroundSize = 'cover';
                sidebarAvatar.style.backgroundPosition = 'center';
                sidebarAvatar.textContent = '';
            }
        }
    }

    /**
     * Handle profile action clicks
     */
    handleActionClick(index) {
        const actions = [
            'Change Password',
            'Notification Preferences',
            'Download My Data'
        ];
        
        this.showNotification(`${actions[index]} functionality coming soon!`, 'info');
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `profile-notification ${type}`;
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
            z-index: 1000;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    /**
     * Handle logout
     */
    handleLogout() {
        if (confirm('Are you sure you want to logout?')) {
            // Show loading state
            const logoutBtn = document.querySelector('.logout-btn');
            logoutBtn.textContent = 'Logging out...';
            logoutBtn.disabled = true;

            // Simulate logout delay
            setTimeout(() => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userData');
                window.location.href = 'login.html';
            }, 800);
        }
    }

    /**
     * Calculate age from date of birth
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
     * Format phone number
     */
    formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        
        if (cleaned.startsWith('63')) {
            const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})$/);
            if (match) {
                return `+${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
            }
        }
        
        return phone;
    }
}

// Add CSS for animations
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
`;
document.head.appendChild(style);

// Initialize profile manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
});

export default ProfileManager;

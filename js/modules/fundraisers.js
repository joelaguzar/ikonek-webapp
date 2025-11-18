// Fundraisers Module

const fundraisersData = [
    {
        id: 1,
        title: "Hope for Typhoon Victims in Mindanao",
        organizer: "Red Cross Philippines",
        category: "Disaster Relief",
        raised: 450000,
        goal: 1000000,
        contributors: 320,
        daysLeft: 25
    },
    {
        id: 2,
        title: "Children's Cancer Fund - St. Luke's",
        organizer: "St. Luke's Foundation",
        category: "Medical Assistance",
        raised: 780000,
        goal: 1500000,
        contributors: 512,
        daysLeft: 40
    },
    {
        id: 3,
        title: "Emergency Surgery Support for Baby Angelo",
        organizer: "Santos Family",
        category: "Medical Emergency",
        raised: 125000,
        goal: 200000,
        contributors: 98,
        daysLeft: 12
    },
    {
        id: 4,
        title: "Community Health Program - Tondo Manila",
        organizer: "Gawad Kalinga",
        category: "Healthcare Access",
        raised: 240000,
        goal: 500000,
        contributors: 156,
        daysLeft: 35
    }
];

class FundraisersManager {
    constructor() {
        this.container = document.getElementById('fundraisersGrid');
        this.init();
    }
    
    init() {
        if (this.container) {
            this.renderFundraisers();
            this.attachEventListeners();
        }
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0
        }).format(amount);
    }
    
    calculatePercentage(raised, goal) {
        return Math.min(Math.round((raised / goal) * 100), 100);
    }
    
    createFundraiserCard(fundraiser) {
        const percentage = this.calculatePercentage(fundraiser.raised, fundraiser.goal);
        
        return `
            <div class="fundraiser-card" data-id="${fundraiser.id}">
                <div class="fundraiser-header">
                    <div class="fundraiser-header-top">
                        <h3 class="fundraiser-title">${fundraiser.title}</h3>
                        <span class="fundraiser-category">${fundraiser.category}</span>
                    </div>
                    <p class="fundraiser-organizer">by ${fundraiser.organizer}</p>
                </div>
                
                <div class="fundraiser-progress">
                    <div class="fundraiser-amounts">
                        <span class="fundraiser-raised">${this.formatCurrency(fundraiser.raised)} raised</span>
                        <span class="fundraiser-goal">${this.formatCurrency(fundraiser.goal)}</span>
                    </div>
                    
                    <div class="fundraiser-progress-bar">
                        <div class="fundraiser-progress-fill" data-percentage="${percentage}" style="width: 0%"></div>
                    </div>
                    
                    <div class="fundraiser-stats">
                        <div class="fundraiser-stat">
                            <img src="../assets/icons/people.svg" alt="Contributors">
                            <span>${fundraiser.contributors} contributors</span>
                        </div>
                        <div class="fundraiser-stat">
                            <img src="../assets/icons/time.svg" alt="Time left">
                            <span>${fundraiser.daysLeft} days left</span>
                        </div>
                    </div>
                </div>
                
                <div class="fundraiser-action">
                    <button class="btn-donate" data-id="${fundraiser.id}">
                        <img src="../assets/icons/heart-white.svg" alt="">
                        Donate Now
                    </button>
                </div>
            </div>
        `;
    }
    
    renderFundraisers() {
        this.container.innerHTML = fundraisersData
            .map(fundraiser => this.createFundraiserCard(fundraiser))
            .join('');
        
        // Animate progress bars
        setTimeout(() => {
            document.querySelectorAll('.fundraiser-progress-fill').forEach(bar => {
                const percentage = bar.getAttribute('data-percentage');
                bar.style.width = `${percentage}%`;
            });
        }, 100);
    }
    
    attachEventListeners() {
        // Donate button clicks
        this.container.addEventListener('click', (e) => {
            const donateBtn = e.target.closest('.btn-donate');
            if (donateBtn) {
                const fundraiserId = donateBtn.getAttribute('data-id');
                this.handleDonate(fundraiserId);
            }
        });
    }
    
    handleDonate(fundraiserId) {
        const fundraiser = fundraisersData.find(f => f.id == fundraiserId);
        if (fundraiser) {
            // Open donation modal
            const modal = new DonationModal(fundraiser);
            modal.open();
        }
    }
}

// Donation Modal Class
class DonationModal {
    constructor(fundraiser) {
        this.fundraiser = fundraiser;
        this.selectedAmount = null;
        this.customAmount = null;
        this.selectedPayment = null;
        this.init();
    }
    
    init() {
        this.createModal();
        this.attachEventListeners();
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0
        }).format(amount);
    }
    
    calculatePercentage(raised, goal) {
        return Math.min(Math.round((raised / goal) * 100), 100);
    }
    
    createModal() {
        const percentage = this.calculatePercentage(this.fundraiser.raised, this.fundraiser.goal);
        
        const modalHTML = `
            <div class="donation-modal" id="donationModal">
                <div class="modal-overlay" id="modalOverlay"></div>
                <div class="modal-content donation-modal-content">
                    <button class="modal-close" id="modalClose" aria-label="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    
                    <div class="modal-header">
                        <div class="modal-title-wrapper">
                            <img src="../assets/icons/heart.svg" alt="" class="modal-icon">
                            <h2 class="modal-title">Make a Donation</h2>
                        </div>
                        <p class="modal-description">Support ${this.fundraiser.title}</p>
                    </div>
                    
                    <div class="modal-body">
                        <!-- Progress Steps -->
                        <div class="donation-steps">
                            <div class="donation-step active">
                                <div class="step-circle">1</div>
                                <span class="step-label">Amount</span>
                            </div>
                            <div class="step-connector"></div>
                            <div class="donation-step">
                                <div class="step-circle">2</div>
                                <span class="step-label">Details</span>
                            </div>
                        </div>
                        
                        <!-- Campaign Summary -->
                        <div class="campaign-summary">
                            <div class="summary-header">
                                <p class="summary-label">Campaign</p>
                                <h3 class="summary-title">${this.fundraiser.title}</h3>
                            </div>
                            <div class="summary-progress">
                                <div class="summary-amounts">
                                    <span class="summary-raised">${this.formatCurrency(this.fundraiser.raised)} raised</span>
                                    <span class="summary-goal">Goal: ${this.formatCurrency(this.fundraiser.goal)}</span>
                                </div>
                                <div class="summary-progress-bar">
                                    <div class="summary-progress-fill" style="width: ${percentage}%"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Amount Selection -->
                        <div class="form-section">
                            <label class="form-label">
                                Select Amount
                                <span class="required">*</span>
                            </label>
                            <div class="amount-grid">
                                <button type="button" class="amount-btn" data-amount="100">₱100</button>
                                <button type="button" class="amount-btn" data-amount="250">₱250</button>
                                <button type="button" class="amount-btn" data-amount="500">₱500</button>
                                <button type="button" class="amount-btn" data-amount="1000">₱1,000</button>
                                <button type="button" class="amount-btn" data-amount="2500">₱2,500</button>
                                <button type="button" class="amount-btn" data-amount="5000">₱5,000</button>
                            </div>
                        </div>
                        
                        <!-- Custom Amount -->
                        <div class="form-section">
                            <label class="form-label">Or Enter Custom Amount</label>
                            <div class="custom-amount-wrapper">
                                <span class="currency-symbol">₱</span>
                                <input 
                                    type="number" 
                                    id="customAmount" 
                                    class="custom-amount-input" 
                                    placeholder="Enter amount"
                                    min="50"
                                    max="1000000"
                                >
                            </div>
                            <p class="form-helper">Minimum: ₱50 | Maximum: ₱1,000,000</p>
                        </div>
                        
                        <!-- Payment Method -->
                        <div class="form-section">
                            <label class="form-label">
                                Payment Method
                                <span class="required">*</span>
                            </label>
                            <div class="payment-grid">
                                <button type="button" class="payment-btn" data-method="gcash">
                                    <img src="../assets/icons/money-green.svg" alt="">
                                    <span>GCash</span>
                                </button>
                                <button type="button" class="payment-btn" data-method="maya">
                                    <img src="../assets/icons/money-green.svg" alt="">
                                    <span>Maya (PayMaya)</span>
                                </button>
                                <button type="button" class="payment-btn" data-method="card">
                                    <img src="../assets/icons/donate.svg" alt="">
                                    <span>Credit/Debit Card</span>
                                </button>
                                <button type="button" class="payment-btn" data-method="bank">
                                    <img src="../assets/icons/money-green.svg" alt="">
                                    <span>Bank Transfer</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Info Box -->
                        <div class="donation-info">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                                <path d="M12 16V12M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            <p>100% of your donation goes to the fundraiser. iKonek does not charge any fees.</p>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline" id="cancelBtn">Cancel</button>
                        <button type="button" class="btn btn-primary" id="continueBtn" disabled>Continue</button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('donationModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('donationModal');
    }
    
    attachEventListeners() {
        // Close modal events
        const closeBtn = document.getElementById('modalClose');
        const cancelBtn = document.getElementById('cancelBtn');
        const overlay = document.getElementById('modalOverlay');
        
        closeBtn.addEventListener('click', () => this.close());
        cancelBtn.addEventListener('click', () => this.close());
        overlay.addEventListener('click', () => this.close());
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'flex') {
                this.close();
            }
        });
        
        // Amount selection
        document.querySelectorAll('.amount-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.selectedAmount = parseInt(e.target.getAttribute('data-amount'));
                
                // Clear custom amount
                const customInput = document.getElementById('customAmount');
                customInput.value = '';
                this.customAmount = null;
                
                this.validateForm();
            });
        });
        
        // Custom amount input
        const customInput = document.getElementById('customAmount');
        customInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            
            if (value >= 50) {
                // Clear preset amounts
                document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('selected'));
                this.selectedAmount = null;
                this.customAmount = value;
            } else {
                this.customAmount = null;
            }
            
            this.validateForm();
        });
        
        // Payment method selection
        document.querySelectorAll('.payment-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.payment-btn').forEach(b => b.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                this.selectedPayment = e.currentTarget.getAttribute('data-method');
                this.validateForm();
            });
        });
        
        // Continue button
        const continueBtn = document.getElementById('continueBtn');
        continueBtn.addEventListener('click', () => this.handleContinue());
    }
    
    validateForm() {
        const continueBtn = document.getElementById('continueBtn');
        const hasAmount = this.selectedAmount !== null || this.customAmount !== null;
        const hasPayment = this.selectedPayment !== null;
        
        continueBtn.disabled = !(hasAmount && hasPayment);
    }
    
    handleContinue() {
        const amount = this.customAmount || this.selectedAmount;
        
        // Save donation data
        const donationData = {
            fundraiser: this.fundraiser,
            amount: amount,
            paymentMethod: this.selectedPayment,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('donationData', JSON.stringify(donationData));
        
        // Close modal and show success message
        this.close();
        
        // Show confirmation
        setTimeout(() => {
            alert(`Thank you for your donation!\n\nAmount: ${this.formatCurrency(amount)}\nTo: ${this.fundraiser.title}\nPayment: ${this.selectedPayment.toUpperCase()}\n\nRedirecting to payment...`);
        }, 300);
    }
    
    open() {
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Animate modal
        setTimeout(() => {
            this.modal.classList.add('active');
        }, 10);
    }
    
    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            this.modal.style.display = 'none';
            this.modal.remove();
        }, 300);
    }
}

// Initialize fundraisers
document.addEventListener('DOMContentLoaded', () => {
    new FundraisersManager();
});

export default FundraisersManager;

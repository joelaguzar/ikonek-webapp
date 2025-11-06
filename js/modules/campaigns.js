// Campaigns Module

const campaignsData = [
    {
        id: 1,
        title: "Help Baby Sofia's Heart Surgery",
        organizer: "Sofia's Family • Manila, Philippines",
        category: "Medical Treatment",
        raised: 450000,
        goal: 800000,
        supporters: 234,
        daysLeft: 12
    },
    {
        id: 2,
        title: "Kidney Transplant for Tatay Ernesto",
        organizer: "Ernesto Support Group • Cebu, Philippines",
        category: "Medical Treatment",
        raised: 1200000,
        goal: 1500000,
        supporters: 456,
        daysLeft: 8
    },
    {
        id: 3,
        title: "Cancer Treatment for Teacher Maria",
        organizer: "Former Students of Maria • Davao City, Philippines",
        category: "Medical Treatment",
        raised: 380000,
        goal: 600000,
        supporters: 189,
        daysLeft: 15
    }
];

class CampaignsManager {
    constructor() {
        this.container = document.getElementById('campaignsGrid');
        this.init();
    }
    
    init() {
        if (this.container) {
            this.renderCampaigns();
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
        return Math.round((raised / goal) * 100);
    }
    
    createCampaignCard(campaign) {
        const percentage = this.calculatePercentage(campaign.raised, campaign.goal);
        
        return `
            <div class="card campaign-card">
                <div class="campaign-header">
                    <div class="campaign-info">
                        <div class="campaign-badge">${campaign.category}</div>
                        <h3 class="campaign-title">${campaign.title}</h3>
                        <p class="campaign-organizer">${campaign.organizer}</p>
                    </div>
                    
                    <div class="campaign-progress">
                        <div class="campaign-amount">
                            <div class="campaign-raised-container">
                                <div class="campaign-raised">${this.formatCurrency(campaign.raised)}</div>
                                <div class="campaign-goal">raised of ${this.formatCurrency(campaign.goal)}</div>
                            </div>
                            <div class="campaign-percentage">${percentage}%</div>
                        </div>
                        
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${percentage}%"></div>
                        </div>
                        
                        <div class="campaign-meta">
                            <div class="campaign-meta-item">
                                <img src="assets/icons/users.svg" alt="Supporters" width="18" height="18">
                                <span>${campaign.supporters} supporters</span>
                            </div>
                            <div class="campaign-meta-item">
                                <img src="assets/icons/clock.svg" alt="Time left" width="18" height="18">
                                <span>${campaign.daysLeft} days left</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <button class="campaign-button" aria-label="Donate to ${campaign.title}">
                    <img src="assets/icons/heart-white.svg" alt="" width="18" height="18">
                    Donate Now
                </button>
            </div>
        `;
    }
    
    renderCampaigns() {
        this.container.innerHTML = campaignsData
            .map(campaign => this.createCampaignCard(campaign))
            .join('');
        
        // Animate progress bars
        setTimeout(() => {
            document.querySelectorAll('.progress-fill').forEach(bar => {
                bar.style.transition = 'width 1s ease-out';
            });
        }, 100);
    }
}

// Initialize campaigns
document.addEventListener('DOMContentLoaded', () => {
    new CampaignsManager();
});

export default CampaignsManager;

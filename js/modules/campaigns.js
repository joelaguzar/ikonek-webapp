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

// Fundraisers data for view-campaign page
const fundraisersData = [
    {
        id: 1,
        title: "Hope for Typhoon Victims in Mindanao",
        organizer: "Red Cross Philippines",
        category: "Disaster Relief",
        raised: 450000,
        goal: 1000000,
        contributors: 320,
        daysLeft: 25,
        image: "../assets/img/campaign-typhoon.jpg",
        description: `
            <p>Typhoon Odette has devastated communities across Mindanao, leaving thousands of families without homes, food, and clean water. The Red Cross Philippines is on the ground providing emergency relief, medical assistance, and shelter to those affected by this disaster.</p>
            
            <p>Your generous donation will help us provide:</p>
            <ul>
                <li>Emergency food packages for affected families</li>
                <li>Clean water and sanitation facilities</li>
                <li>Temporary shelter materials and blankets</li>
                <li>Medical supplies and healthcare services</li>
                <li>Psychosocial support for trauma victims</li>
            </ul>
            
            <p>Every contribution, no matter how small, makes a significant difference in helping these communities rebuild their lives. Together, we can bring hope and relief to those who need it most.</p>
        `,
        recentDonations: [
            { name: "Maria Santos", amount: 5000, time: "2 hours ago" },
            { name: "Juan Dela Cruz", amount: 2500, time: "5 hours ago" },
            { name: "Anonymous", amount: 10000, time: "1 day ago" },
            { name: "Sofia Reyes", amount: 1000, time: "1 day ago" },
            { name: "Miguel Torres", amount: 3000, time: "2 days ago" }
        ]
    },
    {
        id: 2,
        title: "Children's Cancer Fund - St. Luke's",
        organizer: "St. Luke's Foundation",
        category: "Medical Assistance",
        raised: 780000,
        goal: 1500000,
        contributors: 512,
        daysLeft: 40,
        image: "../assets/img/campaign-children.jpg",
        description: `
            <p>St. Luke's Foundation is dedicated to supporting children battling cancer and providing them with access to world-class medical treatment. Our Children's Cancer Fund helps families who cannot afford the high costs of chemotherapy, radiation therapy, and other essential treatments.</p>
            
            <p>Your donation will directly support:</p>
            <ul>
                <li>Chemotherapy and radiation treatments</li>
                <li>Surgical procedures and hospital care</li>
                <li>Medications and medical supplies</li>
                <li>Nutritional support during treatment</li>
                <li>Counseling services for patients and families</li>
            </ul>
            
            <p>Every child deserves a fighting chance against cancer. With your help, we can ensure that no child is denied treatment due to financial constraints. Together, we can give these brave children hope for a healthier future.</p>
        `,
        recentDonations: [
            { name: "Carlos Mendoza", amount: 15000, time: "1 hour ago" },
            { name: "Isabel Garcia", amount: 8000, time: "3 hours ago" },
            { name: "Roberto Cruz", amount: 5000, time: "6 hours ago" },
            { name: "Anonymous", amount: 20000, time: "12 hours ago" },
            { name: "Elena Martinez", amount: 3500, time: "1 day ago" }
        ]
    },
    {
        id: 3,
        title: "Emergency Surgery Support for Baby Angelo",
        organizer: "Santos Family",
        category: "Medical Emergency",
        raised: 125000,
        goal: 200000,
        contributors: 98,
        daysLeft: 12,
        image: "../assets/img/campaign-baby.jpg",
        description: `
            <p>Baby Angelo is a 6-month-old infant who was diagnosed with a congenital heart defect that requires urgent surgery. His parents, a young couple from Quezon City, are struggling to raise the funds needed for this life-saving operation.</p>
            
            <p>The surgery will cost approximately ₱200,000 and includes:</p>
            <ul>
                <li>Pre-operative medical tests and consultations</li>
                <li>Open-heart surgery by a pediatric cardiac surgeon</li>
                <li>ICU care and post-operative monitoring</li>
                <li>Medications and medical supplies</li>
                <li>Follow-up consultations and rehabilitation</li>
            </ul>
            
            <p>Baby Angelo's condition is critical, and time is of the essence. Every donation brings us closer to giving this precious child a chance at a healthy life. Please help us save Baby Angelo's life.</p>
        `,
        recentDonations: [
            { name: "Ana Bautista", amount: 5000, time: "30 minutes ago" },
            { name: "Jose Ramos", amount: 2000, time: "2 hours ago" },
            { name: "Linda Santos", amount: 3000, time: "4 hours ago" },
            { name: "Anonymous", amount: 10000, time: "8 hours ago" },
            { name: "Pedro Diaz", amount: 1500, time: "1 day ago" }
        ]
    },
    {
        id: 4,
        title: "Community Health Program - Tondo Manila",
        organizer: "Gawad Kalinga",
        category: "Healthcare Access",
        raised: 240000,
        goal: 500000,
        contributors: 156,
        daysLeft: 35,
        image: "../assets/img/campaign-community.jpg",
        description: `
            <p>Gawad Kalinga is launching a comprehensive community health program in Tondo, Manila, one of the most densely populated areas in the Philippines. This program aims to provide accessible healthcare services to underserved families and improve overall community health.</p>
            
            <p>Your support will fund:</p>
            <ul>
                <li>Free medical consultations and health screenings</li>
                <li>Immunization programs for children</li>
                <li>Health education workshops and seminars</li>
                <li>Basic medicines and medical supplies</li>
                <li>Maternal and child health services</li>
                <li>Mobile health clinics for remote areas</li>
            </ul>
            
            <p>Access to healthcare is a fundamental right, yet many families in Tondo struggle to afford basic medical services. With your donation, we can bridge this gap and create a healthier, stronger community for everyone.</p>
        `,
        recentDonations: [
            { name: "Ramon Flores", amount: 8000, time: "1 hour ago" },
            { name: "Gloria Navarro", amount: 4000, time: "3 hours ago" },
            { name: "Antonio Reyes", amount: 6000, time: "5 hours ago" },
            { name: "Anonymous", amount: 15000, time: "10 hours ago" },
            { name: "Carmen Silva", amount: 2500, time: "1 day ago" }
        ]
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

// Campaign View Class for view-campaign.html page
class CampaignView {
    constructor() {
        this.campaignId = this.getCampaignIdFromUrl();
        this.campaign = null;
        this.init();
    }
    
    getCampaignIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return parseInt(urlParams.get('id'));
    }
    
    init() {
        if (!this.campaignId) {
            this.showError();
            return;
        }
        
        this.campaign = fundraisersData.find(c => c.id === this.campaignId);
        
        if (!this.campaign) {
            this.showError();
            return;
        }
        
        this.renderCampaign();
        this.attachEventListeners();
    }
    
    showError() {
        window.location.href = 'fundraisers.html';
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    calculatePercentage(raised, goal) {
        return Math.min(Math.round((raised / goal) * 100), 100);
    }
    
    getInitials(name) {
        if (name === 'Anonymous') return 'A';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return parts[0][0] + parts[1][0];
        }
        return name[0];
    }
    
    renderCampaign() {
        // Set page title
        document.title = `${this.campaign.title} - iKonek`;
        
        // Set campaign image
        const campaignImage = document.getElementById('campaignImage');
        if (campaignImage) {
            campaignImage.src = this.campaign.image;
            campaignImage.alt = this.campaign.title;
            
            // Fallback to placeholder if image doesn't exist
            campaignImage.onerror = function() {
                this.src = '../assets/img/campaign-placeholder.jpg';
            };
        }
        
        // Set category badge
        const categoryBadge = document.getElementById('campaignCategory');
        if (categoryBadge) {
            categoryBadge.textContent = this.campaign.category;
        }
        
        // Set title and organizer
        const titleElement = document.getElementById('campaignTitle');
        if (titleElement) {
            titleElement.textContent = this.campaign.title;
        }
        
        const organizerElement = document.getElementById('campaignOrganizer');
        const organizerName = document.getElementById('organizerName');
        if (organizerElement) {
            organizerElement.textContent = this.campaign.organizer;
        }
        if (organizerName) {
            organizerName.textContent = this.campaign.organizer;
        }
        
        // Set amounts
        const amountRaised = document.getElementById('amountRaised');
        const amountGoal = document.getElementById('amountGoal');
        if (amountRaised) {
            amountRaised.textContent = this.formatCurrency(this.campaign.raised);
        }
        if (amountGoal) {
            amountGoal.textContent = this.formatCurrency(this.campaign.goal);
        }
        
        // Set progress bar
        const percentage = this.calculatePercentage(this.campaign.raised, this.campaign.goal);
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            setTimeout(() => {
                progressFill.style.width = `${percentage}%`;
            }, 100);
        }
        
        // Set stats
        const contributorsCount = document.getElementById('contributorsCount');
        const daysLeft = document.getElementById('daysLeft');
        if (contributorsCount) {
            contributorsCount.textContent = this.campaign.contributors;
        }
        if (daysLeft) {
            daysLeft.textContent = this.campaign.daysLeft;
        }
        
        // Set description
        const description = document.getElementById('campaignDescription');
        if (description) {
            description.innerHTML = this.campaign.description;
        }
        
        // Render recent donations
        this.renderDonations();
    }
    
    renderDonations() {
        const donationsList = document.getElementById('donationsList');
        if (!donationsList || !this.campaign.recentDonations) return;
        
        const donationsHTML = this.campaign.recentDonations.map(donation => `
            <div class="donation-item">
                <div class="donation-avatar">${this.getInitials(donation.name)}</div>
                <div class="donation-details">
                    <p class="donation-name">${donation.name}</p>
                    <p class="donation-time">${donation.time}</p>
                </div>
                <div class="donation-amount">${this.formatCurrency(donation.amount)}</div>
            </div>
        `).join('');
        
        donationsList.innerHTML = donationsHTML;
    }
    
    attachEventListeners() {
        // Donate button
        const donateBtn = document.getElementById('donateBtn');
        if (donateBtn) {
            donateBtn.addEventListener('click', () => this.handleDonate());
        }
        
        // Share buttons
        const facebookBtn = document.querySelector('.share-btn.facebook');
        const twitterBtn = document.querySelector('.share-btn.twitter');
        const copyBtn = document.querySelector('.share-btn.copy');
        
        if (facebookBtn) {
            facebookBtn.addEventListener('click', () => this.shareOnFacebook());
        }
        if (twitterBtn) {
            twitterBtn.addEventListener('click', () => this.shareOnTwitter());
        }
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyLink());
        }
    }
    
    handleDonate() {
        // Import and use DonationModal from fundraisers page
        if (typeof DonationModal !== 'undefined') {
            const modal = new DonationModal(this.campaign);
            modal.open();
        } else {
            // Fallback: redirect to fundraisers page with campaign ID
            window.location.href = `fundraisers.html?donate=${this.campaignId}`;
        }
    }
    
    shareOnFacebook() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Help support: ${this.campaign.title}`);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
    }
    
    shareOnTwitter() {
        const url = encodeURIComponent(window.location.href);
        const text = encodeURIComponent(`Help support: ${this.campaign.title} on iKonek! #iKonek #Fundraising`);
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
    }
    
    copyLink() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            const copyBtn = document.querySelector('.share-btn.copy');
            if (copyBtn) {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Link Copied!</span>
                `;
                copyBtn.style.color = '#22C55E';
                copyBtn.style.borderColor = '#22C55E';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.style.color = '';
                    copyBtn.style.borderColor = '';
                }, 2000);
            }
        }).catch(err => {
            console.error('Failed to copy link:', err);
            alert('Failed to copy link. Please copy manually: ' + url);
        });
    }
}

// Initialize campaigns or campaign view depending on the page
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the view-campaign page
    if (window.location.pathname.includes('view-campaign.html')) {
        new CampaignView();
    } else {
        new CampaignsManager();
    }
});

export default CampaignsManager;
export { CampaignView, fundraisersData };

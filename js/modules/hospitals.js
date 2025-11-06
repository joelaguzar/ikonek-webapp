// Hospitals Module

const hospitalsData = [
    {
        id: 1,
        name: "Philippine General Hospital",
        category: "National Referral Center",
        location: "Taft Avenue, Manila",
        region: "Metro Manila",
        phone: "(02) 8554-8400",
        hours: "Mon-Sat: 8:00 AM - 5:00 PM",
        availability: "Available Today"
    },
    {
        id: 2,
        name: "Philippine Heart Center",
        category: "Cardiovascular Specialty",
        location: "East Avenue, Quezon City",
        region: "Metro Manila",
        phone: "(02) 8925-2401",
        hours: "Mon-Fri: 8:00 AM - 4:00 PM",
        availability: "Available Today"
    },
    {
        id: 3,
        name: "Vicente Sotto Memorial Medical Center",
        category: "Regional Hospital",
        location: "B. Rodriguez St, Cebu City",
        region: "Visayas",
        phone: "(032) 253-9891",
        hours: "Mon-Sat: 8:00 AM - 5:00 PM",
        availability: "Available Tomorrow"
    },
    {
        id: 4,
        name: "Southern Philippines Medical Center",
        category: "Regional Hospital",
        location: "J.P. Laurel Ave, Davao City",
        region: "Mindanao",
        phone: "(082) 227-2731",
        hours: "Mon-Sat: 8:00 AM - 5:00 PM",
        availability: "Available Today"
    },
    {
        id: 5,
        name: "St. Luke's Medical Center",
        category: "Tertiary Hospital",
        location: "E. Rodriguez Sr. Ave, Quezon City",
        region: "Metro Manila",
        phone: "(02) 8789-7700",
        hours: "24/7 Blood Bank Services",
        availability: "Available Now"
    },
    {
        id: 6,
        name: "The Medical City",
        category: "Multi-Specialty Hospital",
        location: "Ortigas Avenue, Pasig City",
        region: "Metro Manila",
        phone: "(02) 8988-1000",
        hours: "Mon-Sat: 7:00 AM - 6:00 PM",
        availability: "Available Today"
    }
];

class HospitalsManager {
    constructor() {
        this.container = document.getElementById('hospitalsGrid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'all';
        this.init();
    }
    
    init() {
        if (this.container) {
            this.renderHospitals();
            this.setupFilters();
        }
    }
    
    setupFilters() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Remove active class from all buttons
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Get filter value
                const filter = e.target.getAttribute('data-filter');
                this.currentFilter = filter;
                
                // Filter and render hospitals
                this.renderHospitals();
            });
        });
    }
    
    filterHospitals() {
        if (this.currentFilter === 'all') {
            return hospitalsData;
        }
        
        const filterMap = {
            'metro-manila': 'Metro Manila',
            'visayas': 'Visayas',
            'mindanao': 'Mindanao'
        };
        
        return hospitalsData.filter(hospital => 
            hospital.region === filterMap[this.currentFilter]
        );
    }
    
    createHospitalCard(hospital) {
        return `
            <div class="card hospital-card" data-region="${hospital.region.toLowerCase().replace(' ', '-')}">
                <div class="hospital-header">
                    <div class="hospital-badge">${hospital.category}</div>
                    <h3 class="hospital-name">${hospital.name}</h3>
                </div>
                
                <div class="hospital-details">
                    <div class="hospital-detail">
                        <img src="assets/icons/location.svg" alt="Location" width="20" height="20">
                        <span><strong>Location:</strong> ${hospital.location}</span>
                    </div>
                    
                    <div class="hospital-detail">
                        <img src="assets/icons/phone.svg" alt="Phone" width="20" height="20">
                        <span><strong>Contact:</strong> ${hospital.phone}</span>
                    </div>
                    
                    <div class="hospital-detail">
                        <img src="assets/icons/clock.svg" alt="Hours" width="20" height="20">
                        <span><strong>Hours:</strong> ${hospital.hours}</span>
                    </div>
                    
                    <div class="hospital-detail">
                        <img src="assets/icons/calendar.svg" alt="Availability" width="20" height="20">
                        <span style="color: var(--color-success); font-weight: var(--font-weight-bold);">
                            ${hospital.availability}
                        </span>
                    </div>
                </div>
                
                <div class="hospital-action">
                    <button class="hospital-button">
                        <img src="assets/icons/calendar.svg" alt="" width="16" height="16">
                        Schedule Appointment
                    </button>
                </div>
            </div>
        `;
    }
    
    renderHospitals() {
        const filteredHospitals = this.filterHospitals();
        
        if (filteredHospitals.length === 0) {
            this.container.innerHTML = `
                <div class="no-results">
                    <p>No hospitals found in this region. Try another filter.</p>
                </div>
            `;
            return;
        }
        
        this.container.innerHTML = filteredHospitals
            .map(hospital => this.createHospitalCard(hospital))
            .join('');
    }
}

// Initialize hospitals
document.addEventListener('DOMContentLoaded', () => {
    new HospitalsManager();
});

export default HospitalsManager;

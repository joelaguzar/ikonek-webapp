// History Page Module
// Handles tab switching and history data management

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on the history page
    if (document.querySelector('.history-tabs')) {
        initHistoryPage();
    }
});

function initHistoryPage() {
    // Set up tab switching
    const tabs = document.querySelectorAll('.history-tab');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName, tabs, panels);
        });
    });

    // Set up certificate download buttons
    const certificateButtons = document.querySelectorAll('.btn-certificate');
    certificateButtons.forEach(button => {
        button.addEventListener('click', handleCertificateDownload);
    });

    // Set up view ticket buttons
    const viewTicketButtons = document.querySelectorAll('.btn-view-ticket');
    viewTicketButtons.forEach(button => {
        button.addEventListener('click', handleViewTicket);
    });

    // Set up cancel appointment buttons
    const cancelButtons = document.querySelectorAll('.btn-cancel-appointment');
    cancelButtons.forEach(button => {
        button.addEventListener('click', handleCancelAppointment);
    });

    // Set up receipt download buttons
    const receiptButtons = document.querySelectorAll('.btn-receipt');
    receiptButtons.forEach(button => {
        button.addEventListener('click', handleReceiptDownload);
    });
}

function switchTab(tabName, tabs, panels) {
    // Remove active class from all tabs and panels
    tabs.forEach(tab => tab.classList.remove('active'));
    panels.forEach(panel => panel.classList.remove('active'));

    // Add active class to selected tab and panel
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedPanel = document.getElementById(`${tabName}-panel`);

    if (selectedTab && selectedPanel) {
        selectedTab.classList.add('active');
        selectedPanel.classList.add('active');

        // Load data for the selected tab if needed
        loadTabData(tabName);
    }
}

function loadTabData(tabName) {
    // This function would load data from your backend
    console.log(`Loading data for ${tabName} tab`);

    // In a real application, you would fetch data from your backend here
    // For example:
    // if (tabName === 'scheduled') {
    //     fetchScheduledDonations();
    // } else if (tabName === 'history') {
    //     fetchDonationHistory();
    // } else if (tabName === 'fundraisers') {
    //     fetchFundraiserContributions();
    // }
}

function handleCertificateDownload(event) {
    const button = event.currentTarget;
    const donationRecord = button.closest('.donation-record');
    
    if (!donationRecord) return;

    // Get donation details
    const hospital = donationRecord.querySelector('.donation-hospital')?.textContent;
    
    // Show downloading state
    const originalText = button.innerHTML;
    button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2"/>
        </svg>
        Downloading...
    `;
    button.disabled = true;

    // Simulate download (replace with actual API call)
    setTimeout(() => {
        console.log(`Downloading certificate for ${hospital}`);
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Show success message
        alert(`Certificate for ${hospital} has been downloaded!`);
        
        // In a real application, you would:
        // 1. Make an API call to generate/fetch the certificate
        // 2. Download the PDF file
        // 3. Show appropriate success/error messages
    }, 1500);
}

function handleViewTicket(event) {
    const button = event.currentTarget;
    const donationRecord = button.closest('.donation-record');
    
    if (!donationRecord) return;

    // Get donation details
    const hospital = donationRecord.querySelector('.donation-hospital')?.textContent;
    
    // In a real application, this would open a modal or redirect to the e-ticket page
    console.log(`Viewing e-ticket for ${hospital}`);
    alert(`Opening e-ticket for ${hospital}...\n\nThis would display your appointment confirmation with QR code.`);
}

function handleCancelAppointment(event) {
    const button = event.currentTarget;
    const donationRecord = button.closest('.donation-record');
    
    if (!donationRecord) return;

    // Get donation details
    const hospital = donationRecord.querySelector('.donation-hospital')?.textContent;
    
    // Show confirmation dialog
    const confirmed = confirm(`Are you sure you want to cancel your appointment at ${hospital}?`);
    
    if (confirmed) {
        // Add removing animation
        donationRecord.style.opacity = '0';
        donationRecord.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            donationRecord.remove();
            
            // Check if there are any remaining scheduled donations
            const remainingDonations = document.querySelectorAll('.scheduled-donation');
            if (remainingDonations.length === 0) {
                showEmptyState();
            }
        }, 300);
        
        // In a real application, you would make an API call to cancel the appointment
        console.log(`Cancelled appointment at ${hospital}`);
    }
}

function showEmptyState() {
    const scheduledBody = document.querySelector('#scheduled-panel .history-card-body');
    if (scheduledBody) {
        scheduledBody.innerHTML = `
            <div class="empty-state">
                <p>No upcoming donations scheduled</p>
            </div>
        `;
    }
}

function handleReceiptDownload(event) {
    const button = event.currentTarget;
    const fundraiserRecord = button.closest('.fundraiser-record');
    
    if (!fundraiserRecord) return;

    // Get fundraiser details
    const fundraiserTitle = fundraiserRecord.querySelector('.fundraiser-title')?.textContent;
    const amount = fundraiserRecord.querySelector('.badge-amount')?.textContent;
    
    // Show downloading state
    const originalText = button.innerHTML;
    button.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2"/>
        </svg>
        Downloading...
    `;
    button.disabled = true;

    // Simulate download (replace with actual API call)
    setTimeout(() => {
        console.log(`Downloading receipt for ${fundraiserTitle} - ${amount}`);
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
        // Show success message
        alert(`Receipt for "${fundraiserTitle}" (${amount}) has been downloaded!`);
        
        // In a real application, you would:
        // 1. Make an API call to generate/fetch the receipt
        // 2. Download the PDF file
        // 3. Show appropriate success/error messages
    }, 1500);
}

// Export functions for use in other modules if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initHistoryPage,
        switchTab,
        loadTabData,
        handleCertificateDownload,
        handleViewTicket,
        handleCancelAppointment,
        handleReceiptDownload
    };
}

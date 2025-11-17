// Confirmation Page Module

class ConfirmationPage {
    constructor() {
        this.scheduleAnotherBtn = document.getElementById('scheduleAnotherBtn');
        this.downloadTicketBtn = document.getElementById('downloadTicketBtn');
        this.shareBtn = document.getElementById('shareBtn');
        
        this.init();
    }

    init() {
        // Load and display appointment data
        this.loadAppointmentData();
        
        // Add event listeners
        this.addEventListeners();
        
        // Clear form data after successful confirmation
        this.clearFormData();
    }

    loadAppointmentData() {
        // Get the latest appointment from localStorage
        const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        if (appointments.length === 0) {
            // No appointment found, redirect back
            console.warn('No appointment data found');
            window.location.href = 'dashboard.html';
            return;
        }

        // Get the most recent appointment
        const appointment = appointments[appointments.length - 1];
        
        // Populate the page with appointment data
        this.displayAppointmentData(appointment);
    }

    displayAppointmentData(appointment) {
        // Format date
        const formatDate = (dateString) => {
            if (!dateString) return '-';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        };

        // Update all fields
        document.getElementById('confirmEmail').textContent = appointment.email || '-';
        document.getElementById('appointmentDate').textContent = formatDate(appointment.date);
        document.getElementById('appointmentTime').textContent = appointment.time || '-';
        document.getElementById('appointmentLocation').textContent = appointment.hospitalName || appointment.hospital || '-';
        document.getElementById('appointmentAddress').textContent = appointment.address || 'Taft Avenue, Manila';
        document.getElementById('appointmentPhone').textContent = appointment.hospitalPhone || '+63 2 8554 8400';
        document.getElementById('appointmentBloodType').textContent = appointment.bloodType || '-';
        document.getElementById('appointmentEmail').textContent = appointment.email || '-';
        document.getElementById('appointmentContactPhone').textContent = appointment.phoneNumber || appointment.phone || '-';

        // Store appointment data for later use
        this.currentAppointment = appointment;
    }

    addEventListeners() {
        // Schedule Another button
        this.scheduleAnotherBtn?.addEventListener('click', () => {
            this.handleScheduleAnother();
        });

        // Download Ticket button
        this.downloadTicketBtn?.addEventListener('click', () => {
            this.handleDownloadTicket();
        });

        // Share button
        this.shareBtn?.addEventListener('click', () => {
            this.handleShare();
        });
    }

    handleScheduleAnother() {
        // Clear temporary form data but keep appointments
        this.clearFormData();
        
        // Redirect to schedule donation page
        window.location.href = 'schedule-donation.html';
    }

    handleDownloadTicket() {
        const appointment = this.currentAppointment;
        
        if (!appointment) {
            this.showMessage('Unable to generate ticket', 'error');
            return;
        }

        // Show loading state
        const btnText = this.downloadTicketBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        btnText.textContent = 'Generating...';
        this.downloadTicketBtn.disabled = true;

        // Generate image ticket
        setTimeout(() => {
            this.generateImageTicket(appointment);
        }, 500);
    }

    async generateImageTicket(appointment) {
        try {
            // Create canvas with proper dimensions
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size - optimized for mobile viewing and printing
            canvas.width = 1080;
            canvas.height = 1400;
            
            // Format date helper
            const formatDate = (dateString) => {
                if (!dateString) return '-';
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
            };
            
            // BACKGROUND - Gradient matching app design
            const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            bgGradient.addColorStop(0, '#F8F9FA');
            bgGradient.addColorStop(1, '#FFFFFF');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // HEADER - Navy blue matching app
            ctx.fillStyle = '#1D3557';
            ctx.fillRect(0, 0, canvas.width, 160);
            
            // Logo - iKonek branding
            ctx.fillStyle = '#E63946';
            ctx.font = 'bold 64px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('i', canvas.width / 2 - 65, 80);
            
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText('  Konek', canvas.width / 2 + 25, 80);
            
            ctx.font = '22px Arial, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillText('Blood Donation Platform', canvas.width / 2, 125);
            
            // SUCCESS ICON - Green checkmark with shadow
            const iconY = 230;
            
            // Shadow
            ctx.fillStyle = 'rgba(22, 163, 74, 0.2)';
            ctx.beginPath();
            ctx.arc(canvas.width / 2 + 4, iconY + 4, 56, 0, Math.PI * 2);
            ctx.fill();
            
            // Icon background
            const iconGradient = ctx.createRadialGradient(
                canvas.width / 2, iconY, 0,
                canvas.width / 2, iconY, 56
            );
            iconGradient.addColorStop(0, '#16A34A');
            iconGradient.addColorStop(1, '#15803D');
            ctx.fillStyle = iconGradient;
            ctx.beginPath();
            ctx.arc(canvas.width / 2, iconY, 56, 0, Math.PI * 2);
            ctx.fill();
            
            // Checkmark
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 - 24, iconY);
            ctx.lineTo(canvas.width / 2 - 8, iconY + 20);
            ctx.lineTo(canvas.width / 2 + 28, iconY - 20);
            ctx.stroke();
            
            // TITLE
            ctx.fillStyle = '#1D3557';
            ctx.font = 'bold 42px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Appointment Confirmed!', canvas.width / 2, 340);
            
            // Appointment ID badge
            ctx.fillStyle = 'rgba(230, 57, 70, 0.1)';
            ctx.beginPath();
            ctx.roundRect(canvas.width / 2 - 140, 360, 280, 40, 20);
            ctx.fill();
            
            ctx.fillStyle = '#E63946';
            ctx.font = 'bold 18px Arial, sans-serif';
            ctx.fillText(`ID: ${appointment.id}`, canvas.width / 2, 386);
            
            // MAIN CARD - White card with shadow
            const cardX = 60;
            const cardY = 440;
            const cardWidth = canvas.width - 120;
            const cardHeight = 720;
            
            // Card shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.beginPath();
            ctx.roundRect(cardX + 4, cardY + 4, cardWidth, cardHeight, 16);
            ctx.fill();
            
            // Card background
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 16);
            ctx.fill();
            
            // Card border
            ctx.strokeStyle = 'rgba(29, 53, 87, 0.1)';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Card header - Green accent
            const cardHeaderGradient = ctx.createLinearGradient(cardX, cardY, cardX + cardWidth, cardY);
            cardHeaderGradient.addColorStop(0, 'rgba(113, 156, 99, 0.15)');
            cardHeaderGradient.addColorStop(1, 'rgba(113, 156, 99, 0.08)');
            ctx.fillStyle = cardHeaderGradient;
            ctx.fillRect(cardX, cardY, cardWidth, 60);
            
            ctx.fillStyle = '#1D3557';
            ctx.font = 'bold 24px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Appointment Details', canvas.width / 2, cardY + 38);
            
            // Helper to draw info boxes
            const drawInfoBox = (icon, label, value, subvalue, y, iconBg) => {
                const boxX = cardX + 40;
                const boxWidth = cardWidth - 80;
                
                // Box background
                const boxGradient = ctx.createLinearGradient(boxX, y, boxX + boxWidth, y);
                boxGradient.addColorStop(0, '#F8F9FA');
                boxGradient.addColorStop(1, 'rgba(248, 249, 250, 0.5)');
                ctx.fillStyle = boxGradient;
                ctx.beginPath();
                ctx.roundRect(boxX, y, boxWidth, subvalue ? 90 : 70, 12);
                ctx.fill();
                
                // Box border
                ctx.strokeStyle = 'rgba(29, 53, 87, 0.08)';
                ctx.lineWidth = 1;
                ctx.stroke();
                
                // Icon circle
                const iconX = boxX + 28;
                const iconY = y + (subvalue ? 45 : 35);
                
                ctx.fillStyle = iconBg;
                ctx.beginPath();
                ctx.arc(iconX, iconY, 24, 0, Math.PI * 2);
                ctx.fill();
                
                // Icon emoji
                ctx.font = '28px Arial, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(icon, iconX, iconY + 10);
                
                // Label
                ctx.fillStyle = 'rgba(29, 53, 87, 0.6)';
                ctx.font = '14px Arial, sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(label.toUpperCase(), boxX + 70, y + 22);
                
                // Value
                ctx.fillStyle = '#1D3557';
                ctx.font = 'bold 20px Arial, sans-serif';
                ctx.fillText(value, boxX + 70, y + 48);
                
                // Subvalue if exists
                if (subvalue) {
                    ctx.fillStyle = 'rgba(29, 53, 87, 0.7)';
                    ctx.font = '16px Arial, sans-serif';
                    ctx.fillText(subvalue, boxX + 70, y + 72);
                }
            };
            
            // Draw all info boxes
            let currentY = cardY + 90;
            
            // Date & Time
            drawInfoBox(
                '📅',
                'Date & Time',
                formatDate(appointment.date),
                '🕐 ' + (appointment.time || '-'),
                currentY,
                'rgba(230, 57, 70, 0.1)'
            );
            currentY += 110;
            
            // Location
            drawInfoBox(
                '📍',
                'Location',
                appointment.hospitalName || appointment.hospital || '-',
                appointment.address || 'Taft Avenue, Manila',
                currentY,
                'rgba(29, 53, 87, 0.1)'
            );
            currentY += 110;
            
            // Blood Type
            drawInfoBox(
                '🩸',
                'Blood Type',
                appointment.bloodType || '-',
                null,
                currentY,
                'rgba(230, 57, 70, 0.1)'
            );
            currentY += 90;
            
            // Contact
            drawInfoBox(
                '📧',
                'Contact Information',
                appointment.email || '-',
                '📞 ' + (appointment.phoneNumber || appointment.phone || '-'),
                currentY,
                'rgba(29, 53, 87, 0.1)'
            );
            
            // REMINDERS BOX
            const remindersY = 1190;
            const remindersX = cardX;
            const remindersWidth = cardWidth;
            
            // Reminders background - Blue gradient
            const remindersGradient = ctx.createLinearGradient(remindersX, remindersY, remindersX + remindersWidth, remindersY);
            remindersGradient.addColorStop(0, '#EFF6FF');
            remindersGradient.addColorStop(1, '#DBEAFE');
            ctx.fillStyle = remindersGradient;
            ctx.beginPath();
            ctx.roundRect(remindersX, remindersY, remindersWidth, 160, 16);
            ctx.fill();
            
            // Reminders border
            ctx.strokeStyle = '#BFDBFE';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Reminders title
            ctx.fillStyle = '#1E40AF';
            ctx.font = 'bold 22px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('⚠️  Important Reminders', canvas.width / 2, remindersY + 35);
            
            // Reminders list
            ctx.fillStyle = '#1E3A8A';
            ctx.font = '17px Arial, sans-serif';
            ctx.textAlign = 'left';
            
            const reminders = [
                '✓  Arrive 15 minutes before your scheduled time',
                '✓  Bring a valid government-issued ID',
                '✓  Eat a healthy meal and stay well hydrated'
            ];
            
            let reminderY = remindersY + 65;
            reminders.forEach(reminder => {
                ctx.fillText(reminder, remindersX + 40, reminderY);
                reminderY += 30;
            });
            
            // FOOTER
            ctx.fillStyle = 'rgba(29, 53, 87, 0.5)';
            ctx.font = '16px Arial, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Thank you for saving lives! 🩸', canvas.width / 2, 1370);
            
            // Convert canvas to blob and download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `iKonek-Appointment-${appointment.id}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                // Reset button
                this.downloadTicketBtn.querySelector('.btn-text').textContent = 'Download Ticket';
                this.downloadTicketBtn.disabled = false;
                
                this.showMessage('Ticket image downloaded successfully!', 'success');
            }, 'image/png');
            
        } catch (error) {
            console.error('Error generating ticket:', error);
            this.downloadTicketBtn.querySelector('.btn-text').textContent = 'Download Ticket';
            this.downloadTicketBtn.disabled = false;
            this.showMessage('Error generating ticket', 'error');
        }
    }

    handleShare() {
        const appointment = this.currentAppointment;
        
        if (!appointment) {
            this.showMessage('Unable to share appointment', 'error');
            return;
        }

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        };

        const shareText = `I just scheduled a blood donation appointment with iKonek!\n\nDate: ${formatDate(appointment.date)}\nTime: ${appointment.time}\nLocation: ${appointment.hospitalName || appointment.hospital}\n\nJoin me in saving lives! 🩸`;
        
        // Check if Web Share API is available
        if (navigator.share) {
            navigator.share({
                title: 'iKonek Blood Donation Appointment',
                text: shareText,
            })
            .then(() => {
                this.showMessage('Shared successfully!', 'success');
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Error sharing:', error);
                    this.fallbackShare(shareText);
                }
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            this.fallbackShare(shareText);
        }
    }

    fallbackShare(text) {
        // Copy to clipboard as fallback
        navigator.clipboard.writeText(text)
            .then(() => {
                this.showMessage('Appointment details copied to clipboard!', 'success');
            })
            .catch(() => {
                this.showMessage('Unable to share appointment', 'error');
            });
    }

    clearFormData() {
        // Clear step-by-step form data but keep appointments
        localStorage.removeItem('scheduleFormData');
        localStorage.removeItem('contactFormData');
        localStorage.removeItem('healthFormData');
        localStorage.removeItem('scheduleFormDraft');
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `toast-message toast-${type}`;
        
        let bgColor = '#457B9D';
        let icon = 'ℹ️';
        
        if (type === 'success') {
            bgColor = '#16A34A';
            icon = '✓';
        }
        if (type === 'error') {
            bgColor = '#DC3545';
            icon = '✕';
        }
        
        messageDiv.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-text">${message}</span>
        `;
        
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            background: ${bgColor};
            color: white;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 12px;
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

    .toast-icon {
        font-size: 18px;
        line-height: 1;
    }

    .toast-text {
        flex: 1;
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ConfirmationPage();
    });
} else {
    new ConfirmationPage();
}

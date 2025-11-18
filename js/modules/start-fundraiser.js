// Start Fundraiser Step 1 Module

class StartFundraiser {
    constructor() {
        this.form = document.getElementById('fundraiserForm');
        this.titleInput = document.getElementById('campaignTitle');
        this.descriptionInput = document.getElementById('campaignDescription');
        this.imagesInput = document.getElementById('campaignImages');
        this.uploadArea = document.getElementById('uploadArea');
        this.uploadPreview = document.getElementById('uploadPreview');
        this.goalAmountInput = document.getElementById('goalAmount');
        this.durationSelect = document.getElementById('campaignDuration');
        
        this.selectedImages = [];
        this.maxImages = 5;
        this.maxImageSize = 3 * 1024 * 1024; // 3MB
        
        this.init();
    }
    
    init() {
        this.attachEventListeners();
        this.loadDraftData();
    }
    
    attachEventListeners() {
        // Character counters
        if (this.titleInput) {
            this.titleInput.addEventListener('input', () => this.updateCharCount('title'));
        }
        
        if (this.descriptionInput) {
            this.descriptionInput.addEventListener('input', () => this.updateCharCount('description'));
        }
        
        // Upload area
        if (this.uploadArea) {
            this.uploadArea.addEventListener('click', () => this.imagesInput.click());
            this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        }
        
        if (this.imagesInput) {
            this.imagesInput.addEventListener('change', (e) => this.handleImageSelect(e));
        }
        
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        // Auto-save draft
        const formInputs = this.form.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('change', () => this.saveDraft());
        });
    }
    
    updateCharCount(type) {
        if (type === 'title') {
            const count = this.titleInput.value.length;
            const counter = document.getElementById('titleCharCount');
            if (counter) {
                counter.textContent = count;
            }
        } else if (type === 'description') {
            const count = this.descriptionInput.value.length;
            const counter = document.getElementById('descCharCount');
            if (counter) {
                counter.textContent = count;
            }
        }
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.uploadArea.style.borderColor = '#E63946';
        this.uploadArea.style.background = 'rgba(230, 57, 70, 0.08)';
    }
    
    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.uploadArea.style.borderColor = '';
        this.uploadArea.style.background = '';
        
        const files = Array.from(e.dataTransfer.files);
        this.processImages(files);
    }
    
    handleImageSelect(e) {
        const files = Array.from(e.target.files);
        this.processImages(files);
    }
    
    processImages(files) {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (this.selectedImages.length + imageFiles.length > this.maxImages) {
            alert(`You can only upload a maximum of ${this.maxImages} images.`);
            return;
        }
        
        imageFiles.forEach(file => {
            if (file.size > this.maxImageSize) {
                alert(`${file.name} is too large. Maximum size is 3MB.`);
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                this.selectedImages.push({
                    file: file,
                    dataUrl: e.target.result,
                    name: file.name
                });
                this.renderImagePreviews();
            };
            reader.readAsDataURL(file);
        });
    }
    
    renderImagePreviews() {
        if (!this.uploadPreview) return;
        
        this.uploadPreview.innerHTML = this.selectedImages.map((img, index) => `
            <div class="preview-item">
                <img src="${img.dataUrl}" alt="${img.name}" class="preview-image">
                <button type="button" class="preview-remove" data-index="${index}" aria-label="Remove image">
                    &times;
                </button>
            </div>
        `).join('');
        
        // Attach remove handlers
        this.uploadPreview.querySelectorAll('.preview-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.getAttribute('data-index'));
                this.removeImage(index);
            });
        });
    }
    
    removeImage(index) {
        this.selectedImages.splice(index, 1);
        this.renderImagePreviews();
        this.saveDraft();
    }
    
    validateForm() {
        const errors = [];
        
        // Title validation
        const title = this.titleInput.value.trim();
        if (!title) {
            errors.push('Campaign title is required');
        } else if (title.length < 10) {
            errors.push('Campaign title must be at least 10 characters');
        }
        
        // Category validation
        const category = this.form.querySelector('input[name="category"]:checked');
        if (!category) {
            errors.push('Please select a category');
        }
        
        // Description validation
        const description = this.descriptionInput.value.trim();
        if (!description) {
            errors.push('Campaign description is required');
        } else if (description.length < 150) {
            errors.push('Campaign description must be at least 150 characters');
        }
        
        // Goal amount validation
        const goalAmount = parseFloat(this.goalAmountInput.value);
        if (!goalAmount) {
            errors.push('Goal amount is required');
        } else if (goalAmount < 5000) {
            errors.push('Goal amount must be at least ₱5,000');
        } else if (goalAmount > 10000000) {
            errors.push('Goal amount cannot exceed ₱10,000,000');
        }
        
        // Duration validation
        const duration = this.durationSelect.value;
        if (!duration) {
            errors.push('Please select campaign duration');
        }
        
        return errors;
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const errors = this.validateForm();
        
        if (errors.length > 0) {
            alert('Please fix the following errors:\n\n' + errors.join('\n'));
            return;
        }
        
        // Get form data
        const formData = this.getFormData();
        
        // Save to localStorage
        localStorage.setItem('fundraiserDraft', JSON.stringify(formData));
        
        // Navigate to next step
        alert('Form data saved successfully!\n\nProceeding to Step 2 (Review)...');
        // window.location.href = 'start-fundraiser-step2.html';
    }
    
    getFormData() {
        const category = this.form.querySelector('input[name="category"]:checked');
        
        return {
            title: this.titleInput.value.trim(),
            category: category ? category.value : '',
            description: this.descriptionInput.value.trim(),
            goalAmount: parseFloat(this.goalAmountInput.value),
            duration: this.durationSelect.value,
            images: this.selectedImages.map(img => ({
                name: img.name,
                dataUrl: img.dataUrl
            })),
            timestamp: new Date().toISOString()
        };
    }
    
    saveDraft() {
        try {
            const formData = this.getFormData();
            localStorage.setItem('fundraiserDraft', JSON.stringify(formData));
            console.log('Draft saved');
        } catch (error) {
            console.error('Error saving draft:', error);
        }
    }
    
    loadDraftData() {
        try {
            const draftData = localStorage.getItem('fundraiserDraft');
            if (!draftData) return;
            
            const data = JSON.parse(draftData);
            
            // Restore form values
            if (data.title) {
                this.titleInput.value = data.title;
                this.updateCharCount('title');
            }
            
            if (data.category) {
                const categoryRadio = this.form.querySelector(`input[name="category"][value="${data.category}"]`);
                if (categoryRadio) {
                    categoryRadio.checked = true;
                }
            }
            
            if (data.description) {
                this.descriptionInput.value = data.description;
                this.updateCharCount('description');
            }
            
            if (data.goalAmount) {
                this.goalAmountInput.value = data.goalAmount;
            }
            
            if (data.duration) {
                this.durationSelect.value = data.duration;
            }
            
            if (data.images && data.images.length > 0) {
                this.selectedImages = data.images;
                this.renderImagePreviews();
            }
            
            console.log('Draft loaded');
        } catch (error) {
            console.error('Error loading draft:', error);
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new StartFundraiser();
    });
} else {
    new StartFundraiser();
}

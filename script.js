// ─────────────────────────────────────────────
// WHATSAPP NUMBER — update if it ever changes
// ─────────────────────────────────────────────
const WA_NUMBER = '264814595351'; // +264 81 459 5351

function sendToWhatsApp(message) {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
}

// ─────────────────────────────────────────────
// MOBILE MENU
// ─────────────────────────────────────────────
document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
});

document.addEventListener('click', function(event) {
    const nav = document.querySelector('.nav-links');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (!nav.contains(event.target) && !menuBtn.contains(event.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
    }
});

// ─────────────────────────────────────────────
// AUCTION FORMS → WHATSAPP
// ─────────────────────────────────────────────
function setupAuctionForm(formId, itemName, currentBid) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const bidAmountInput = form.querySelector('input[name="bid_amount"]');
        const bidderName     = form.querySelector('input[name="bidder_name"]');
        const bidderContact  = form.querySelector('input[name="bidder_email"]');
        const bidAmount      = parseInt(bidAmountInput.value);
        const minIncrement   = 5;

        if (isNaN(bidAmount) || bidAmount < currentBid + minIncrement) {
            alert(`Bid must be at least N$${currentBid + minIncrement}`);
            return;
        }
        if (!bidderName.value.trim()) {
            alert('Please enter your name or Instagram handle');
            return;
        }
        if (!bidderContact.value.trim()) {
            alert('Please enter your contact details');
            return;
        }

        const message =
            `🔨 *NEW BID — ${itemName}*\n\n` +
            `Bid Amount: N$${bidAmount}\n` +
            `Name / IG: ${bidderName.value.trim()}\n` +
            `Contact: ${bidderContact.value.trim()}`;

        sendToWhatsApp(message);
        showSuccess(`Your bid of N$${bidAmount} has been sent! We'll confirm shortly.`);
        form.reset();
    });
}

setupAuctionForm('bidForm1', 'DRKSHDW Ricks', 1200);
setupAuctionForm('bidForm2', 'Rick Docs',     850);

// ─────────────────────────────────────────────
// SHOP FILTERING
// ─────────────────────────────────────────────
document.querySelectorAll('.filter').forEach(filter => {
    filter.addEventListener('click', function() {
        const filterValue = this.getAttribute('data-filter');

        document.querySelectorAll('.filter').forEach(f => f.classList.remove('active'));
        this.classList.add('active');

        document.querySelectorAll('.product-card').forEach(product => {
            if (filterValue === 'all' || product.getAttribute('data-category') === filterValue) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });
});

// ─────────────────────────────────────────────
// SHOP PURCHASE → WHATSAPP
// ─────────────────────────────────────────────
document.querySelectorAll('.shop-form').forEach(form => {
    const button = form.querySelector('button[type="submit"]');
    button.type = 'button';

    button.addEventListener('click', function() {
        const product  = form.querySelector('input[name="product"]')?.value  || 'Product';
        const price    = form.querySelector('input[name="price"]')?.value    || '';
        const category = form.querySelector('input[name="category"]')?.value || '';

        const contactInfo = prompt(
            `Purchase: ${product} (${price})\n\nEnter your name or Instagram handle:`
        );

        if (!contactInfo || contactInfo.trim() === '') {
            alert('Purchase cancelled');
            return;
        }

        const message =
            `🛍️ *SHOP PURCHASE REQUEST*\n\n` +
            `Item: ${product}\n` +
            `Price: ${price}\n` +
            `Category: ${category}\n` +
            `Customer: ${contactInfo.trim()}`;

        const originalText = showLoading(this);
        setTimeout(() => {
            sendToWhatsApp(message);
            hideLoading(this, originalText);
            showSuccess(`Purchase request for ${product} sent to WhatsApp! We'll confirm payment and delivery details shortly.`);
        }, 500);
    });
});

// ─────────────────────────────────────────────
// FORM UTILITIES
// ─────────────────────────────────────────────
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(message, fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function showLoading(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<div class="spinner"></div> Processing...';
    button.classList.add('btn-loading');
    button.disabled = true;
    return originalText;
}

function hideLoading(button, originalText) {
    button.innerHTML = originalText;
    button.classList.remove('btn-loading');
    button.disabled = false;
}

function showSuccess(message) {
    const modal = document.getElementById('successModal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

// ─────────────────────────────────────────────
// IMAGE UPLOAD PREVIEW (Consignment)
// ─────────────────────────────────────────────
function setupImageUploadPreview() {
    const photoUpload      = document.getElementById('photoUpload');
    const uploadPreview    = document.getElementById('uploadPreview');
    const previewContainer = document.getElementById('previewContainer');

    if (!photoUpload || !uploadPreview || !previewContainer) return;

    photoUpload.addEventListener('change', function() {
        let files = Array.from(this.files);
        previewContainer.innerHTML = '';

        if (files.length === 0) {
            uploadPreview.style.display = 'none';
            return;
        }

        uploadPreview.style.display = 'block';

        if (files.length > 5) {
            alert('Maximum 5 images allowed. Only the first 5 will be used.');
            const dt = new DataTransfer();
            files.slice(0, 5).forEach(file => dt.items.add(file));
            this.files = dt.files;
            files = files.slice(0, 5);
        }

        files.forEach((file, index) => {
            if (!file.type.startsWith('image/')) {
                alert(`"${file.name}" is not an image. Please select image files only.`);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert(`"${file.name}" exceeds the 5MB limit. Please compress or resize it.`);
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                const imgWrapper = document.createElement('div');
                imgWrapper.className = 'preview-item';
                imgWrapper.style.cssText = `
                    position: relative; width: 80px; height: 80px;
                    border: 1px solid var(--border); border-radius: 4px;
                    overflow: hidden; background: var(--surface-light);
                `;

                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';

                const removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.innerHTML = '×';
                removeBtn.title = 'Remove this image';
                removeBtn.style.cssText = `
                    position: absolute; top: 2px; right: 2px;
                    background: #ff6b6b; color: white; border: none;
                    border-radius: 50%; width: 20px; height: 20px;
                    font-size: 12px; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; z-index: 2;
                `;

                removeBtn.addEventListener('click', function(ev) {
                    ev.preventDefault();
                    const dt = new DataTransfer();
                    Array.from(photoUpload.files).forEach((f, i) => { if (i !== index) dt.items.add(f); });
                    photoUpload.files = dt.files;
                    imgWrapper.remove();
                    if (photoUpload.files.length === 0) uploadPreview.style.display = 'none';
                });

                imgWrapper.appendChild(img);
                imgWrapper.appendChild(removeBtn);
                previewContainer.appendChild(imgWrapper);
            };
            reader.readAsDataURL(file);
        });
    });
}

// ─────────────────────────────────────────────
// CONSIGNMENT FORM → WHATSAPP
// ─────────────────────────────────────────────
const consignmentForm   = document.getElementById('consignmentForm');
const consignmentSubmit = document.getElementById('consignmentSubmit');

if (consignmentForm) {
    consignmentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        clearError('name');
        clearError('email');
        clearError('items');

        let isValid = true;

        const name = document.getElementById('name').value.trim();
        if (!name) { showError('Please enter your name', 'name'); isValid = false; }

        const email = document.getElementById('email').value.trim();
        if (!email || !validateEmail(email)) { showError('Please enter a valid email address', 'email'); isValid = false; }

        const items = document.getElementById('items').value.trim();
        if (!items) { showError('Please describe the items', 'items'); isValid = false; }

        if (!isValid) return;

        const instagram  = document.getElementById('instagram').value.trim();
        const photoLinks = document.getElementById('photoLinks').value.trim();

        const message =
            `📦 *CONSIGNMENT REQUEST*\n\n` +
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            (instagram  ? `Instagram: ${instagram}\n`    : '') +
            `\nItems:\n${items}\n` +
            (photoLinks ? `\nPhoto Links:\n${photoLinks}` : '');

        const originalText = showLoading(consignmentSubmit);
        setTimeout(() => {
            sendToWhatsApp(message);
            hideLoading(consignmentSubmit, originalText);
            showSuccess("Consignment request sent to WhatsApp! We'll review your items and get back to you shortly.");
            consignmentForm.reset();
            const uploadPreview    = document.getElementById('uploadPreview');
            const previewContainer = document.getElementById('previewContainer');
            if (uploadPreview)    uploadPreview.style.display = 'none';
            if (previewContainer) previewContainer.innerHTML  = '';
        }, 500);
    });
}

// ─────────────────────────────────────────────
// COMMISSION FORM → WHATSAPP
// ─────────────────────────────────────────────
const commissionForm   = document.getElementById('commissionForm');
const commissionSubmit = document.getElementById('commissionSubmit');

if (commissionForm) {
    commissionForm.addEventListener('submit', function(e) {
        e.preventDefault();

        ['clientName', 'clientEmail', 'itemType', 'design', 'budget', 'timeline'].forEach(clearError);

        let isValid = true;

        const name = document.getElementById('clientName').value.trim();
        if (!name) { showError('Please enter your name', 'clientName'); isValid = false; }

        const email = document.getElementById('clientEmail').value.trim();
        if (!email || !validateEmail(email)) { showError('Please enter a valid email address', 'clientEmail'); isValid = false; }

        const itemType = document.getElementById('itemType').value;
        if (!itemType) { showError('Please select an item type', 'itemType'); isValid = false; }

        const design = document.getElementById('designDescription').value.trim();
        if (!design) { showError('Please describe your design inspiration', 'design'); isValid = false; }

        const budget = document.getElementById('budget').value;
        if (!budget) { showError('Please select a budget range', 'budget'); isValid = false; }

        const timeline = document.getElementById('timeline').value;
        if (!timeline) { showError('Please select a completion date', 'timeline'); isValid = false; }

        if (!isValid) return;

        const itemStatus = document.querySelector('input[name="itemStatus"]:checked')?.value === 'have'
            ? 'Has the item ready'
            : 'Needs a base piece sourced';

        const message =
            `🎨 *COMMISSION REQUEST*\n\n` +
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Item Type: ${itemType}\n` +
            `Item Status: ${itemStatus}\n` +
            `Budget: N$${budget}\n` +
            `Deadline: ${timeline}\n` +
            `\nDesign Inspiration:\n${design}`;

        const originalText = showLoading(commissionSubmit);
        setTimeout(() => {
            sendToWhatsApp(message);
            hideLoading(commissionSubmit, originalText);
            showSuccess("Commission request sent to WhatsApp! We'll send you a quote shortly.");
            commissionForm.reset();
        }, 500);
    });
}

// ─────────────────────────────────────────────
// REAL-TIME FORM VALIDATION
// ─────────────────────────────────────────────
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', function() {
        clearError(this.id);
    });

    input.addEventListener('blur', function() {
        if (this.id.toLowerCase().includes('email')) {
            const email = this.value.trim();
            if (email && !validateEmail(email)) {
                showError('Please enter a valid email address', this.id);
            }
        }
    });
});

// ─────────────────────────────────────────────
// SMOOTH SCROLLING
// ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

// ─────────────────────────────────────────────
// INITIALISE
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
    setupImageUploadPreview();

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    const modal = document.getElementById('successModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });
    }
});

window.closeModal    = closeModal;
window.validateEmail = validateEmail;
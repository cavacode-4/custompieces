// ─────────────────────────────────────────────
// WHATSAPP NUMBER
// ─────────────────────────────────────────────
const WA_NUMBER = '264814595351'; // +264 81 459 5351

function sendToWhatsApp(message) {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');
}

// ─────────────────────────────────────────────
// MOBILE MENU
// ─────────────────────────────────────────────
document.querySelector('.mobile-menu-btn').addEventListener('click', function () {
    document.querySelector('.nav-links').classList.toggle('active');
});

document.addEventListener('click', function (event) {
    const nav     = document.querySelector('.nav-links');
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

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const bidAmountInput = form.querySelector('input[name="bid_amount"]');
        const bidderName     = form.querySelector('input[name="bidder_name"]');
        const bidderIg       = form.querySelector('input[name="bidder_instagram"]');
        const bidAmount      = parseInt(bidAmountInput.value);
        const minIncrement   = 5;

        // Validate bid amount
        if (isNaN(bidAmount) || bidAmount < currentBid + minIncrement) {
            alert(`Bid must be at least N$${currentBid + minIncrement}`);
            return;
        }

        // Validate name
        if (!bidderName.value.trim()) {
            alert('Please enter your name');
            return;
        }

        // Validate Instagram
        if (!bidderIg.value.trim()) {
            alert('Please enter your Instagram handle');
            return;
        }

        const message =
            `🔨 *NEW BID — ${itemName}*\n\n` +
            `Bid Amount: N$${bidAmount}\n` +
            `Name: ${bidderName.value.trim()}\n` +
            `Instagram: ${bidderIg.value.trim()}`;

        sendToWhatsApp(message);
        showSuccess(`Your bid of N$${bidAmount} has been sent via WhatsApp! We'll confirm shortly.`);
        form.reset();
    });
}

// Update these numbers whenever you update the current bids in the HTML
setupAuctionForm('bidForm1', 'DRKSHDW Ricks', 1200);
setupAuctionForm('bidForm2', 'Rick Docs',     850);

// ─────────────────────────────────────────────
// SHOP FILTERING
// ─────────────────────────────────────────────
document.querySelectorAll('.filter').forEach(filter => {
    filter.addEventListener('click', function () {
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

    button.addEventListener('click', function () {
        const product  = form.querySelector('input[name="product"]')?.value  || 'Product';
        const price    = form.querySelector('input[name="price"]')?.value    || '';
        const category = form.querySelector('input[name="category"]')?.value || '';

        let name = prompt(`Purchase: ${product} (${price})\n\nEnter your name:`);
        if (!name || name.trim() === '') {
            alert('Purchase cancelled - name required');
            return;
        }
        name = name.trim();

        let instagram = prompt(`Purchase: ${product} (${price})\n\nEnter your Instagram handle (e.g., @username):`);
        if (!instagram || instagram.trim() === '') {
            alert('Purchase cancelled - Instagram handle required');
            return;
        }
        instagram = instagram.trim();

        const message =
            `🛍️ *SHOP PURCHASE REQUEST*\n\n` +
            `Item: ${product}\n` +
            `Price: ${price}\n` +
            `Category: ${category}\n` +
            `Customer Name: ${name}\n` +
            `Instagram: ${instagram}`;

        sendToWhatsApp(message);
        showSuccess(`Purchase request for ${product} sent via WhatsApp! We'll confirm payment and delivery details shortly.`);
    });
});

// ─────────────────────────────────────────────
// FORM UTILITIES
// ─────────────────────────────────────────────
function showError(message, fieldId) {
    const el = document.getElementById(fieldId + 'Error');
    if (el) { el.textContent = message; el.classList.add('show'); }
}

function clearError(fieldId) {
    const el = document.getElementById(fieldId + 'Error');
    if (el) el.classList.remove('show');
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
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('successModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

// ─────────────────────────────────────────────
// CONSIGNMENT FORM → WHATSAPP
// ─────────────────────────────────────────────
const consignmentForm   = document.getElementById('consignmentForm');
const consignmentSubmit = document.getElementById('consignmentSubmit');

if (consignmentForm) {
    consignmentForm.addEventListener('submit', function (e) {
        e.preventDefault();

        clearError('name');
        clearError('instagram');
        clearError('items');

        let isValid = true;

        const name = document.getElementById('name').value.trim();
        if (!name) { showError('Please enter your name', 'name'); isValid = false; }

        const instagram = document.getElementById('instagram').value.trim();
        if (!instagram) { showError('Please enter your Instagram handle so we can tag you', 'instagram'); isValid = false; }

        const items = document.getElementById('items').value.trim();
        if (!items) { showError('Please describe the items', 'items'); isValid = false; }

        if (!isValid) return;

        const photoLinks = document.getElementById('photoLinks').value.trim();

        const message =
            `📦 *CONSIGNMENT REQUEST*\n\n` +
            `Name: ${name}\n` +
            `Instagram: ${instagram}\n` +
            `\nItems:\n${items}` +
            (photoLinks ? `\n\nPhoto Links:\n${photoLinks}` : '');

        sendToWhatsApp(message);

        const originalText = showLoading(consignmentSubmit);
        showSuccess("Consignment request sent via WhatsApp! We'll review your items and get back to you shortly.");
        consignmentForm.reset();
        hideLoading(consignmentSubmit, originalText);
    });
}

// ─────────────────────────────────────────────
// COMMISSION FORM → WHATSAPP
// ─────────────────────────────────────────────
const commissionForm   = document.getElementById('commissionForm');
const commissionSubmit = document.getElementById('commissionSubmit');

if (commissionForm) {
    commissionForm.addEventListener('submit', function (e) {
        e.preventDefault();

        ['clientName', 'clientInstagram', 'itemType', 'design', 'budget', 'timeline'].forEach(clearError);

        let isValid = true;

        const name = document.getElementById('clientName').value.trim();
        if (!name) { showError('Please enter your name', 'clientName'); isValid = false; }

        const instagram = document.getElementById('clientInstagram').value.trim();
        if (!instagram) { showError('Please enter your Instagram handle so we can tag you', 'clientInstagram'); isValid = false; }

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
            `Instagram: ${instagram}\n` +
            `Item Type: ${itemType}\n` +
            `Item Status: ${itemStatus}\n` +
            `Budget: ${budget}\n` +
            `Deadline: ${timeline}\n` +
            `\nDesign Inspiration:\n${design}`;

        sendToWhatsApp(message);

        const originalText = showLoading(commissionSubmit);
        showSuccess("Commission request sent via WhatsApp! We'll send you a quote shortly.");
        commissionForm.reset();
        hideLoading(commissionSubmit, originalText);
    });
}

// ─────────────────────────────────────────────
// CLEAR ERRORS ON INPUT
// ─────────────────────────────────────────────
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('input', function () {
        clearError(this.id);
    });
});

// ─────────────────────────────────────────────
// SMOOTH SCROLLING
// ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (target) {
            window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

// ─────────────────────────────────────────────
// INITIALISE
// ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    const modal = document.getElementById('successModal');
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
});

window.closeModal = closeModal;

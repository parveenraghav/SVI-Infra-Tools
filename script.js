// Main Application Controller
document.addEventListener('DOMContentLoaded', function() {
    // Initialize jsPDF
    window.jsPDF = window.jspdf.jsPDF;
    
    // Load default page
    loadPage('allotment');
    
    // Setup navigation event listeners
    setupNavigation();
    
    // Handle URL hash changes
    window.addEventListener('hashchange', handleHashChange);
});

// Setup Navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-tab-button');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pageName = this.getAttribute('data-page');
            loadPage(pageName);
            updateActiveTab(this);
            updateURL(pageName);
        });
    });
}

// Load Page Content
function loadPage(pageName) {
    const mainContent = document.getElementById('main-content');
    
    // Show loading indicator
    mainContent.innerHTML = `
        <div class="loading-container">
            <div class="loader"></div>
            <p>Loading ${pageName} page...</p>
        </div>
    `;
    
    // Fetch page content
    fetch(`pages/${pageName}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Page not found');
            }
            return response.text();
        })
        .then(html => {
            mainContent.innerHTML = html;
            
            // Load page-specific JavaScript (the script's onload will call initializePage when ready)
            loadPageScript(pageName);
        })
        .catch(error => {
            mainContent.innerHTML = `
                <div class="error-container">
                    <h2>Error Loading Page</h2>
                    <p>${error.message}</p>
                    <button onclick="loadPage('allotment')">Go to Home</button>
                </div>
            `;
            console.error('Error loading page:', error);
        });
}

// Load Page-Specific JavaScript
function loadPageScript(pageName) {
    // Remove existing script if any
    const existingScript = document.getElementById(`${pageName}-script`);
    if (existingScript) {
        existingScript.remove();
    }
    
    // Create new script element
    const script = document.createElement('script');
    script.id = `${pageName}-script`;
    script.src = `js/${pageName}.js`;
    script.onerror = function() {
        console.warn(`Failed to load ${pageName}.js`);
    };

    // When page script finishes loading, call initializePage so page-level init runs (e.g., attach handlers)
    script.onload = function() {
        try {
            initializePage(pageName);
        } catch (err) {
            console.error('Error during page initialization:', err);
        }
    };
    
    document.body.appendChild(script);
}

// Initialize Page
function initializePage(pageName) {
    switch(pageName) {
        case 'allotment':
            if (typeof initAllotmentPage === 'function') {
                initAllotmentPage();
            }
            break;
        case 'payment':
            if (typeof initPaymentPage === 'function') {
                initPaymentPage();
            }
            break;
        case 'calculator':
            if (typeof initCalculatorPage === 'function') {
                initCalculatorPage();
            }
            break;
        case 'offer':
            if (typeof initOfferPage === 'function') {
                initOfferPage();
            }
            break;
    }
}

// Update Active Tab
function updateActiveTab(activeButton) {
    const navButtons = document.querySelectorAll('.nav-tab-button');
    navButtons.forEach(button => button.classList.remove('active'));
    activeButton.classList.add('active');
}

// Update URL
function updateURL(pageName) {
    window.history.pushState({}, '', `#${pageName}`);
}

// Handle URL Hash Change
function handleHashChange() {
    const hash = window.location.hash.substring(1);
    const validPages = ['allotment', 'payment', 'calculator', 'offer'];
    
    if (validPages.includes(hash)) {
        const button = document.querySelector(`.nav-tab-button[data-page="${hash}"]`);
        if (button) {
            button.click();
        }
    }
}

// Common Utility Functions
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function showSuccess(elementId) {
    const successMessage = document.getElementById(elementId);
    if (successMessage) {
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    }
}
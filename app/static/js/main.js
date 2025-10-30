// Initialize new navigation
function setupNewNavigation() {
    setupMobileMenu();
    setupAccountDropdown();
    setupEnhancedSearch();
    updateAccountDisplay();
}

// Mobile menu functionality
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const closeMobileMenu = document.querySelector('.close-mobile-menu');

    if (hamburger && mobileOverlay) {
        hamburger.addEventListener('click', () => {
            mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeMobileMenu && mobileOverlay) {
        closeMobileMenu.addEventListener('click', () => {
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close mobile menu when clicking on links
    const mobileLinks = document.querySelectorAll('.mobile-menu-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', (e) => {
            if (e.target === mobileOverlay) {
                mobileOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Account dropdown functionality
function setupAccountDropdown() {
    const accountToggle = document.getElementById('account-toggle');
    const accountMenu = document.querySelector('.account-menu');

    if (accountToggle && accountMenu) {
        // Populate account menu based on login state
        updateAccountMenu();
        
        // Toggle menu on click (for mobile)
        accountToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            accountMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', () => {
            accountMenu.classList.remove('active');
        });

        // Prevent menu from closing when clicking inside
        accountMenu.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// Update account menu content based on login state
function updateAccountMenu() {
    const accountMenu = document.querySelector('.account-menu');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (accountMenu) {
        if (currentUser) {
            // User is logged in
            accountMenu.innerHTML = `
                <div class="account-menu-header" style="padding: 12px 20px; border-bottom: 1px solid var(--light-gray); margin-bottom: 8px;">
                    <div style="font-weight: 600; color: var(--navy);">Hi, ${currentUser.fullName}</div>
                    <div style="font-size: 0.8rem; color: var(--charcoal);">${currentUser.email}</div>
                </div>
                <a href="user-interface.html" class="account-menu-item">
                    <i class="fas fa-user" style="margin-right: 8px;"></i>
                    My Account
                </a>
                <a href="#orders" class="account-menu-item">
                    <i class="fas fa-box" style="margin-right: 8px;"></i>
                    Orders
                </a>
                <a href="#wishlist" class="account-menu-item">
                    <i class="fas fa-heart" style="margin-right: 8px;"></i>
                    Wishlist
                </a>
                <div class="account-menu-divider"></div>
                <a href="#" class="account-menu-item" id="logout-menu-item">
                    <i class="fas fa-sign-out-alt" style="margin-right: 8px;"></i>
                    Logout
                </a>
            `;

            // Add logout functionality
            const logoutItem = document.getElementById('logout-menu-item');
            if (logoutItem) {
                logoutItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    logoutUser();
                });
            }
        } else {
            // User is not logged in
            accountMenu.innerHTML = `
                <a href="#" class="account-menu-item" id="login-menu-item">
                    <i class="fas fa-sign-in-alt" style="margin-right: 8px;"></i>
                    Sign In
                </a>
                <a href="#" class="account-menu-item" id="signup-menu-item">
                    <i class="fas fa-user-plus" style="margin-right: 8px;"></i>
                    Create Account
                </a>
                <div class="account-menu-divider"></div>
                <a href="#orders" class="account-menu-item">
                    <i class="fas fa-box" style="margin-right: 8px;"></i>
                    Orders
                </a>
                <a href="#wishlist" class="account-menu-item">
                    <i class="fas fa-heart" style="margin-right: 8px;"></i>
                    Wishlist
                </a>
            `;

            // Add login/signup functionality
            const loginItem = document.getElementById('login-menu-item');
            const signupItem = document.getElementById('signup-menu-item');

            if (loginItem) {
                loginItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.getElementById('login-modal').style.display = 'block';
                    accountMenu.classList.remove('active');
                });
            }

            if (signupItem) {
                signupItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.getElementById('signup-modal').style.display = 'block';
                    accountMenu.classList.remove('active');
                });
            }
        }
    }
}

// Update account display text
function updateAccountDisplay() {
    const accountText = document.getElementById('account-text');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (accountText) {
        if (currentUser) {
            accountText.textContent = `Hi, ${currentUser.fullName.split(' ')[0]}`;
        } else {
            accountText.textContent = 'Account';
        }
    }
}

// Enhanced search functionality
function setupEnhancedSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchInput && searchBtn) {
        const performSearch = () => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                // Show search results (you can implement actual search logic here)
                showAlert(`Searching for: "${searchTerm}"`, 'info');
                
                // For now, just log the search term
                console.log('Search term:', searchTerm);
                
                // Clear search input
                searchInput.value = '';
            }
        };

        searchBtn.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// ==================== FEATURED PRODUCTS ====================

// Featured Products Data 
const featuredProducts = [
    {
        id: 1,
        name: "Midnight Oud",
        brand: "H&T Luxe",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1590736969953-7ce4d1c63f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "men",
        scent: "woody",
        mood: "confident",
        season: "winter"
    },
    {
        id: 2,
        name: "Velvet Rose",
        brand: "H&T Luxe",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1590737400275-54a5c7f4ecc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "women",
        scent: "floral",
        mood: "romantic",
        season: "spring"
    },
    {
        id: 3,
        name: "Ocean Breeze",
        brand: "H&T Luxe",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1544468266-6a8948001c78?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "unisex",
        scent: "citrus",
        mood: "energetic",
        season: "summer"
    },
    {
        id: 4,
        name: "Sandalwood Essence",
        brand: "H&T Luxe",
        price: 94.99,
        image: "https://images.unsplash.com/photo-1615634260167-6a76c217f7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "men",
        scent: "woody",
        mood: "calm",
        season: "autumn"
    }
];

// Display Featured Products
function displayFeaturedProducts() {
    const productsGrid = document.getElementById('featured-products');
    
    if (productsGrid) {
        featuredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-brand">${product.brand}</p>
                    <p class="product-price">$${product.price}</p>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                        <button class="btn btn-secondary add-to-wishlist" data-id="${product.id}">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        });
        
        // Add event listeners for buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
        
        document.querySelectorAll('.add-to-wishlist').forEach(button => {
            button.addEventListener('click', addToWishlist);
        });
    }
}

// Add to Cart Functionality
function addToCart(e) {
    const productId = e.target.getAttribute('data-id');
    const product = featuredProducts.find(p => p.id == productId);
    
    
    showAlert(`Added ${product.name} to cart!`, 'success');
    
    // Update cart count in UI (if implemented)
    updateCartCount();
}

// Add to Wishlist Functionality
function addToWishlist(e) {
    const productId = e.target.closest('.add-to-wishlist').getAttribute('data-id');
    const product = featuredProducts.find(p => p.id == productId);
    const heartIcon = e.target.closest('.add-to-wishlist').querySelector('i');
    
    // Toggle heart icon
    if (heartIcon.classList.contains('far')) {
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        showAlert(`Added ${product.name} to wishlist!`, 'success');
    } else {
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        showAlert(`Removed ${product.name} from wishlist!`, 'info');
    }
    
}

// Update Cart Count (placeholder function)
function updateCartCount() {
    // This would update the cart count in the navigation
    console.log('Cart updated');
}

// Contact Form Submission
const messageForm = document.getElementById('message-form');
if (messageForm) {
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        showAlert(`Thank you for your message, ${name}! We'll get back to you soon.`, 'success');
        
        // Reset form
        this.reset();
    });
}


// Basic authentication for home page
function setupHomeAuth() {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const myAccountBtn = document.querySelector('.icon-link[title="My Account"]');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-modal').style.display = 'block';
        });
    }

    // Signup modal
    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('signup-modal').style.display = 'block';
        });
    }

    // My Account icon
    if (myAccountBtn) {
        myAccountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                window.location.href = 'user-interface.html';
            } else {
                document.getElementById('login-modal').style.display = 'block';
            }
        });
    }

    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
        });
    });

    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

 // ========== FORM SUBMISSION HANDLERS ==========
    // Form submission handlers for home page
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleHomeLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleHomeSignup);
    }
   

     // Real-time password validation
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }
}


// Home page login handler
async function handleHomeLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store session token and user data
            localStorage.setItem('sessionToken', data.sessionToken);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Login successful
            showAlert(`Welcome back, ${data.user.fullName}!`, 'success');
            document.getElementById('login-modal').style.display = 'none';
            e.target.reset();
            
            updateAuthUI();
            
            // Redirect to dashboard if we're on home page
            if (window.location.pathname.includes('index.html')) {
                setTimeout(() => {
                    window.location.href = 'user-interface.html';
                }, 1000);
            }
        } else {
            showAlert(data.error, 'error');
        }
    } catch (error) {
        showAlert('Login failed. Please try again.', 'error');
    }
}

// Home page signup handler
async function handleHomeSignup(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim().toLowerCase();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }

    // Password validation
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters', 'error');
        return;
    }

    // Password match validation
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }

    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fullName, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Store session token and user data
            localStorage.setItem('sessionToken', data.sessionToken);
            localStorage.setItem('currentUser', JSON.stringify(data.user));
            
            // Signup successful
            showAlert(`Account created successfully! Welcome, ${data.user.fullName}!`, 'success');
            document.getElementById('signup-modal').style.display = 'none';
            e.target.reset();
            
            updateAuthUI();
            
            // Clear password match error
            const errorElement = document.getElementById('password-match-error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
            
            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'user-interface.html';
            }, 1000);
        } else {
            showAlert(data.error, 'error');
        }
    } catch (error) {
        showAlert('Signup failed. Please try again.', 'error');
    }
}

// Update auth UI for home page
function updateAuthUI() {
    const authLinks = document.querySelector('.auth-links');
    const currentUser = localStorage.getItem('currentUser');
    
    if (authLinks && currentUser) {
        const user = JSON.parse(currentUser);
        authLinks.innerHTML = `
            <span style="color: var(--silver); font-weight: 600;">Welcome, ${user.fullName}</span>
            <span class="auth-separator">|</span>
            <a href="#" class="auth-link" id="logout-btn">Logout</a>
        `;
        
        // Add logout event listener
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                updateAuthUI();
                showAlert('Logged out successfully', 'success');
                location.reload();
            });
        }
    }

     // Also update the account dropdown
    updateAccountMenu();
    updateAccountDisplay();
}

// Real-time password match validation
function validatePasswordMatch() {
    const password = document.getElementById('signup-password');
    const confirmPassword = document.getElementById('signup-confirm-password');
    
    if (password && confirmPassword) {
        if (confirmPassword.value && password.value !== confirmPassword.value) {
            confirmPassword.style.borderColor = '#e74c3c';
        } else if (confirmPassword.value && password.value === confirmPassword.value) {
            confirmPassword.style.borderColor = '#27ae60';
        } else {
            confirmPassword.style.borderColor = '';
        }
    }
}

// Logout function
async function logoutUser() {
    const sessionToken = localStorage.getItem('sessionToken');
    
    if (sessionToken) {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': sessionToken
                }
            });
        } catch (error) {
            console.error('Logout API call failed:', error);
        }
    }
    
    // Clear local storage
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('currentUser');
    
    updateAuthUI();
    showAlert('Logged out successfully', 'success');
    
    // Redirect to home page if we're on dashboard
    if (window.location.pathname.includes('user-interface.html')) {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

async function checkAuthentication() {
    const sessionToken = localStorage.getItem('sessionToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (sessionToken && savedUser) {
        try {
            const response = await fetch('/api/auth/me', {
                headers: {
                    'Authorization': sessionToken
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                currentUser = data.user;
                updateAuthUI();
            } else {
                // Token invalid, clear localStorage
                localStorage.removeItem('sessionToken');
                localStorage.removeItem('currentUser');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            // Fallback to localStorage if API fails
            if (savedUser) {
                currentUser = JSON.parse(savedUser);
                updateAuthUI();
            }
        }
    }
}

// ==================== MODAL & ALERT FUNCTIONS ====================

// Modal switching functions for home page
function switchToSignup() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('signup-modal').style.display = 'block';
}

function switchToLogin() {
    document.getElementById('signup-modal').style.display = 'none';
    document.getElementById('login-modal').style.display = 'block';
}

// Alert function for main.js (if user.js doesn't load first)
function showAlert(message, type = 'info') {
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertElement = document.createElement('div');
    alertElement.className = `alert-message alert-${type}`;
    alertElement.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    alertElement.style.cssText = `
        position: fixed;
        top: 120px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 12px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        animation: slideIn 0.3s ease;
        min-width: 300px;
        backdrop-filter: blur(10px);
        ${type === 'success' ? 
            'background: linear-gradient(135deg, rgba(39, 174, 96, 0.95), rgba(46, 204, 113, 0.95));' : 
            type === 'error' ?
            'background: linear-gradient(135deg, rgba(231, 76, 60, 0.95), rgba(192, 57, 43, 0.95));' :
            'background: linear-gradient(135deg, rgba(52, 152, 219, 0.95), rgba(41, 128, 185, 0.95));'
        }
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        border: 1px solid rgba(255,255,255,0.2);
    `;

    document.body.appendChild(alertElement);

    setTimeout(() => {
        alertElement.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertElement.remove(), 300);
    }, 4000);
}

// Add CSS for alert animations (only if not already added)
if (!document.querySelector('style[data-alert-animations]')) {
    const alertStyle = document.createElement('style');
    alertStyle.setAttribute('data-alert-animations', 'true');
    alertStyle.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(alertStyle);
}


// ==================== CHRISTMAS BANNER FUNCTIONALITY ====================

function initChristmasBanner() {
    const banner = document.querySelector('.sticky-banner');
    const closeBtn = document.querySelector('.close-banner');
    
    if (!banner) return;
    
    // Check if user previously closed the banner
    if (sessionStorage.getItem('bannerClosed') !== 'true') {
        showBanner();
    }
    
    // Close button functionality
    if (closeBtn) {
        closeBtn.addEventListener('click', closeBanner);
    }
    
    // Make phone number clickable
    const phoneNumber = document.querySelector('.phone-number');
    if (phoneNumber) {
        phoneNumber.addEventListener('click', function() {
            window.open('tel:+233591373371');
        });
    }
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeBanner();
    });
}

function showBanner() {
    const banner = document.querySelector('.sticky-banner');
    if (banner) {
        banner.style.display = 'block';
        document.body.classList.add('banner-visible');
    }
}

function closeBanner() {
    const banner = document.querySelector('.sticky-banner');
    if (banner) {
        banner.style.display = 'none';
        document.body.classList.remove('banner-visible');
        sessionStorage.setItem('bannerClosed', 'true');
    }
}

// Initialize banner when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initChristmasBanner();
});



// ==================== INITIALIZATION ====================

// SINGLE DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM fully loaded - initializing main.js');
    
    // Check authentication first
    await checkAuthentication();

    // Initialize new navigation system
    setupNewNavigation();

    // Initialize featured products
    displayFeaturedProducts();
    
    // Initialize authentication
    setupHomeAuth();
    
    // Update auth UI on page load
    //updateAuthUI();

    console.log('Initialization complete');
    
});

    
          




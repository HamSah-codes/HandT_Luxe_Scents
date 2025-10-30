// User Interface JavaScript

// User Authentication State
let currentUser = null;


// User data
let userCart = [];
let userWishlist = [];
let userReviews = [];


// All Products Data
const allProducts = [
    {
        id: 1,
        name: "Midnight Oud",
        brand: "H&T Luxe",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1590736969953-7ce4d1c63f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "men",
        scent: "woody",
        brandType: "ht-luxe",
        mood: "confident",
        season: "winter",
        description: "A rich and intense fragrance with oud wood notes"
    },
    {
        id: 2,
        name: "Velvet Rose",
        brand: "H&T Luxe",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1590737400275-54a5c7f4ecc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "women",
        scent: "floral",
        brandType: "ht-luxe",
        mood: "romantic",
        season: "spring",
        description: "Elegant floral scent with rose and jasmine notes"
    },
    {
        id: 3,
        name: "Ocean Breeze",
        brand: "H&T Luxe",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1544468266-6a8948001c78?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "unisex",
        scent: "citrus",
        brandType: "ht-luxe",
        mood: "energetic",
        season: "summer",
        description: "Fresh and invigorating citrus aquatic fragrance"
    },
    {
        id: 4,
        name: "Sandalwood Essence",
        brand: "H&T Luxe",
        price: 94.99,
        image: "https://images.unsplash.com/photo-1615634260167-6a76c217f7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "men",
        scent: "woody",
        brandType: "ht-luxe",
        mood: "calm",
        season: "autumn",
        description: "Warm and comforting sandalwood fragrance"
    },
    {
        id: 5,
        name: "Citrus Bloom",
        brand: "Premium",
        price: 74.99,
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "unisex",
        scent: "citrus",
        brandType: "premium",
        mood: "energetic",
        season: "summer",
        description: "Bright citrus notes with floral undertones"
    },
    {
        id: 6,
        name: "Oriental Nights",
        brand: "Exclusive",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1546453573-2cffef054b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "women",
        scent: "oriental",
        brandType: "exclusive",
        mood: "romantic",
        season: "winter",
        description: "Exotic oriental fragrance with spice notes"
    }
];


// ==================== AUTHENTICATION FUNCTIONS ====================

// Protect dashboard access
function protectDashboard() {
    if (window.location.pathname.includes('user-interface.html')) {
        if (!currentUser) {
            showAlert('Please log in to access your dashboard', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return false;
        }
    }
    return true;
}

// Authentication Functions
function setupAuthModals() {
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

    // My Account icon - check authentication
    if (myAccountBtn) {
        myAccountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) {
                // User is logged in, redirect to dashboard
                window.location.href = 'user-interface.html';
            } else {
                // User is not logged in, show login modal
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

    // Real-time password confirmation validation
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', validatePasswordMatch);
    }

    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

// Real-time password match validation
function validatePasswordMatch() {
    const password = document.getElementById('signup-password');
    const confirmPassword = document.getElementById('signup-confirm-password');
    const errorElement = document.getElementById('password-match-error') || createPasswordErrorElement();

    if (password && confirmPassword) {
        if (confirmPassword.value && password.value !== confirmPassword.value) {
            errorElement.textContent = 'Passwords do not match';
            errorElement.style.color = '#e74c3c';
            errorElement.style.display = 'block';
            confirmPassword.style.borderColor = '#e74c3c';
        } else if (confirmPassword.value && password.value === confirmPassword.value) {
            errorElement.textContent = 'Passwords match!';
            errorElement.style.color = '#27ae60';
            errorElement.style.display = 'block';
            confirmPassword.style.borderColor = '#27ae60';
        } else {
            errorElement.style.display = 'none';
            confirmPassword.style.borderColor = '';
        }
    }
}

function createPasswordErrorElement() {
    const errorElement = document.createElement('div');
    errorElement.id = 'password-match-error';
    errorElement.style.cssText = `
        font-size: 0.8rem;
        margin-top: 5px;
        display: none;
        font-weight: 600;
    `;
    
    const confirmPassword = document.getElementById('signup-confirm-password');
    if (confirmPassword && confirmPassword.parentNode) {
        confirmPassword.parentNode.appendChild(errorElement);
    }
    
    return errorElement;
}


// ==================== BACKEND AUTHENTICATION FUNCTIONS ====================

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    // Validation
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
            currentUser = data.user;
            showAlert(`Welcome back, ${data.user.fullName}!`, 'success');
            document.getElementById('login-modal').style.display = 'none';
            e.target.reset();
            
            updateAuthUI();
            updateWelcomeMessage();
            
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

async function handleSignup(e) {
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
            currentUser = data.user;
            showAlert(`Account created successfully! Welcome, ${data.user.fullName}!`, 'success');
            document.getElementById('signup-modal').style.display = 'none';
            e.target.reset();
            
            updateAuthUI();
            updateWelcomeMessage();
            
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
    currentUser = null;
    
    updateAuthUI();
    updateWelcomeMessage();
    showAlert('Logged out successfully', 'success');
    
    // Redirect to home page if we're on dashboard
    if (window.location.pathname.includes('user-interface.html')) {
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Update checkAuthentication to use backend
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
                updateWelcomeMessage();
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
                updateWelcomeMessage();
            }
        }
    }
}



function updateAuthUI() {
    const authLinks = document.querySelector('.auth-links');
    const myAccountBtn = document.querySelector('.icon-link[title="My Account"]');
    
    if (authLinks) {
        if (currentUser) {
            authLinks.innerHTML = `
                <span style="color: var(--silver); font-weight: 600;">Welcome, ${currentUser.fullName}</span>
                <span class="auth-separator">|</span>
                <a href="#" class="auth-link" id="logout-btn">Logout</a>
            `;
            
            // Add logout event listener
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    logoutUser();
                });
            }
        } else {
            authLinks.innerHTML = `
                <a href="#" class="auth-link" id="login-btn">Login</a>
                <span class="auth-separator">|</span>
                <a href="#" class="auth-link" id="signup-btn">Create Account</a>
            `;
            
            // Re-attach event listeners
            const loginBtn = document.getElementById('login-btn');
            const signupBtn = document.getElementById('signup-btn');
            
            if (loginBtn) {
                loginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.getElementById('login-modal').style.display = 'block';
                });
            }
            
            if (signupBtn) {
                signupBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.getElementById('signup-modal').style.display = 'block';
                });
            }
        }
    }
    
    // Update My Account icon tooltip
    if (myAccountBtn) {
        if (currentUser) {
            myAccountBtn.setAttribute('title', `My Account (${currentUser.fullName})`);
            myAccountBtn.style.background = 'linear-gradient(135deg, var(--gold) 0%, var(--light-gold) 100%)';
        } else {
            myAccountBtn.setAttribute('title', 'Login / Create Account');
            myAccountBtn.style.background = 'var(--light-gray)';
        }
    }
}

function updateWelcomeMessage() {
    const dashboardTitle = document.querySelector('.dashboard-title');
    if (dashboardTitle) {
        if (currentUser) {
            dashboardTitle.innerHTML = `Welcome, <span style="color: var(--gold); text-shadow: 0 2px 4px rgba(0,0,0,0.1);">${currentUser.fullName}</span>`;
        } else {
            dashboardTitle.textContent = 'Welcome to Your Dashboard';
        }
    }
}

function showAlert(message, type) {
    const existingAlert = document.querySelector('.alert-message');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertElement = document.createElement('div');
    alertElement.className = `alert-message alert-${type}`;
    alertElement.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
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
            'background: linear-gradient(135deg, rgba(231, 76, 60, 0.95), rgba(192, 57, 43, 0.95));'
        }
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        border: 1px solid ${type === 'success' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.2)'};
    `;

    document.body.appendChild(alertElement);

    setTimeout(() => {
        alertElement.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alertElement.remove(), 300);
    }, 4000);
}



// Modal switching functions
function switchToSignup() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('signup-modal').style.display = 'block';
}

function switchToLogin() {
    document.getElementById('signup-modal').style.display = 'none';
    document.getElementById('login-modal').style.display = 'block';
}


// ==================== DASHBOARD FUNCTIONS ====================



// Display All Products
function displayAllProducts(products = allProducts) {
    const productsGrid = document.getElementById('all-products');
    
    if (productsGrid) {
        productsGrid.innerHTML = '';
        
        products.forEach(product => {
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
        
        // Add event listeners
        attachProductEventListeners();
    }
}



// Display Wishlist
function displayWishlist() {
    const wishlistGrid = document.getElementById('wishlist-items');
    
    if (wishlistGrid) {
        wishlistGrid.innerHTML = '';
        
        if (userWishlist.length === 0) {
            wishlistGrid.innerHTML = '<p class="empty-message">Your wishlist is empty</p>';
            return;
        }
        
        userWishlist.forEach(itemId => {
            const product = allProducts.find(p => p.id === itemId);
            if (product) {
                const wishlistItem = document.createElement('div');
                wishlistItem.className = 'wishlist-item';
                
                wishlistItem.innerHTML = `
                    <div class="wishlist-item-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="wishlist-item-details">
                        <h4>${product.name}</h4>
                        <p>${product.brand}</p>
                        <p class="product-price">$${product.price}</p>
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="btn btn-primary move-to-cart" data-id="${product.id}">Add to Cart</button>
                        <button class="btn btn-secondary remove-from-wishlist" data-id="${product.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                
                wishlistGrid.appendChild(wishlistItem);
            }
        });
        
        // Add event listeners for wishlist actions
        document.querySelectorAll('.move-to-cart').forEach(button => {
            button.addEventListener('click', moveToCart);
        });
        
        document.querySelectorAll('.remove-from-wishlist').forEach(button => {
            button.addEventListener('click', removeFromWishlist);
        });
    }
}

// Display Cart
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartItems) {
        cartItems.innerHTML = '';
        
        if (userCart.length === 0) {
            cartItems.innerHTML = '<p class="empty-message">Your cart is empty</p>';
            if (cartTotal) cartTotal.textContent = '0.00';
            return;
        }
        
        let total = 0;
        
        userCart.forEach(item => {
            const product = allProducts.find(p => p.id === item.productId);
            if (product) {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                
                const itemTotal = product.price * item.quantity;
                total += itemTotal;
                
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4>${product.name}</h4>
                        <p>${product.brand}</p>
                        <p class="product-price">$${product.price}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease" data-id="${product.id}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${product.id}">+</button>
                    </div>
                    <div class="cart-item-total">
                        $${itemTotal.toFixed(2)}
                    </div>
                    <div class="cart-item-actions">
                        <button class="btn btn-secondary remove-from-cart" data-id="${product.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                cartItems.appendChild(cartItem);
            }
        });
        
        if (cartTotal) cartTotal.textContent = total.toFixed(2);
        
        // Add event listeners for cart actions
        document.querySelectorAll('.increase').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
        
        document.querySelectorAll('.decrease').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }
}

// Display User Reviews
function displayUserReviews() {
    const reviewsContainer = document.getElementById('user-reviews');
    
    if (reviewsContainer) {
        reviewsContainer.innerHTML = '';
        
        if (userReviews.length === 0) {
            reviewsContainer.innerHTML = '<p class="empty-message">You haven\'t written any reviews yet</p>';
            return;
        }
        
        userReviews.forEach(review => {
            const product = allProducts.find(p => p.id === review.productId);
            if (product) {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-card';
                
                reviewCard.innerHTML = `
                    <div class="review-header">
                        <span class="review-product">${product.name}</span>
                        <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
                    </div>
                    <p class="review-text">${review.text}</p>
                    <div class="review-date">${review.date}</div>
                `;
                
                reviewsContainer.appendChild(reviewCard);
            }
        });
    }
}

// Filter Products
function setupFilters() {
    const genderFilter = document.getElementById('gender-filter');
    const scentFilter = document.getElementById('scent-filter');
    const brandFilter = document.getElementById('brand-filter');
    const moodFilter = document.getElementById('mood-filter');
    const seasonFilter = document.getElementById('season-filter');
    
    const filters = [genderFilter, scentFilter, brandFilter, moodFilter, seasonFilter];
    
    filters.forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
}

function applyFilters() {
    const gender = document.getElementById('gender-filter').value;
    const scent = document.getElementById('scent-filter').value;
    const brand = document.getElementById('brand-filter').value;
    const mood = document.getElementById('mood-filter').value;
    const season = document.getElementById('season-filter').value;
    
    let filteredProducts = allProducts;
    
    if (gender) {
        filteredProducts = filteredProducts.filter(product => product.category === gender);
    }
    
    if (scent) {
        filteredProducts = filteredProducts.filter(product => product.scent === scent);
    }
    
    if (brand) {
        filteredProducts = filteredProducts.filter(product => product.brandType === brand);
    }
    
    if (mood) {
        filteredProducts = filteredProducts.filter(product => product.mood === mood);
    }
    
    if (season) {
        filteredProducts = filteredProducts.filter(product => product.season === season);
    }
    
    displayAllProducts(filteredProducts);
}

// Product Event Listeners
function attachProductEventListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.addEventListener('click', addToWishlist);
    });
}

// Cart Functions
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    
    const existingItem = userCart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        userCart.push({
            productId: productId,
            quantity: 1
        });
    }
    
    displayCart();
    updateBadgeCounts();
    showAlert('Product added to cart!', 'success');
}

function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = userCart.find(item => item.productId === productId);
    
    if (item) {
        item.quantity += 1;
        displayCart();
    }
}

function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = userCart.find(item => item.productId === productId);
    
    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            userCart = userCart.filter(item => item.productId !== productId);
        }
        displayCart();
    }
}

function removeFromCart(e) {
    const productId = parseInt(e.target.closest('.remove-from-cart').getAttribute('data-id'));
    userCart = userCart.filter(item => item.productId !== productId);
    displayCart();
}

// Wishlist Functions
function addToWishlist(e) {
    const productId = parseInt(e.target.closest('.add-to-wishlist').getAttribute('data-id'));
    const heartIcon = e.target.closest('.add-to-wishlist').querySelector('i');
    
    if (!userWishlist.includes(productId)) {
        userWishlist.push(productId);
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        showAlert('Product added to wishlist!', 'success');
    } else {
        userWishlist = userWishlist.filter(id => id !== productId);
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        showAlert('Product removed from wishlist!', 'info');
    }
    
    displayWishlist();
    updateBadgeCounts();
}

function moveToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    
    // Remove from wishlist
    userWishlist = userWishlist.filter(id => id !== productId);
    
    // Add to cart
    const existingItem = userCart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        userCart.push({
            productId: productId,
            quantity: 1
        });
    }
    
    displayWishlist();
    displayCart();
    showAlert('Product moved to cart!', 'success');
}

function removeFromWishlist(e) {
    const productId = parseInt(e.target.closest('.remove-from-wishlist').getAttribute('data-id'));
    userWishlist = userWishlist.filter(id => id !== productId);
    displayWishlist();
}

// Review Functions
function setupReviewForm() {
    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const productId = parseInt(document.getElementById('review-product').value);
            const rating = parseInt(document.getElementById('review-rating').value);
            const text = document.getElementById('review-text').value;
            
            const newReview = {
                productId: productId,
                rating: rating,
                text: text,
                date: new Date().toLocaleDateString()
            };
            
            userReviews.push(newReview);
            displayUserReviews();
            this.reset();
            showAlert('Review submitted!', 'success');
        });
    }
}

// Direct Message Form
function setupDirectMessageForm() {
    const messageForm = document.getElementById('direct-message-form');
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const subject = document.getElementById('message-subject').value;
            const message = document.getElementById('direct-message').value;
            
            // In a real app, this would send to the backend
            showAlert('Message sent! We will get back to you soon.', 'success');
            this.reset();
        });
    }
}

// Checkout Function
function setupCheckout() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (userCart.length === 0) {
                showAlert('Your cart is empty!', 'error');
                return;
            }
            
            showAlert('Proceeding to checkout!', 'success');
        });
    }
}


// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        const performSearch = () => {
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (searchTerm) {
                const filteredProducts = allProducts.filter(product => 
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.brand.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm) ||
                    product.scent.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm)
                );

                if (filteredProducts.length === 0) {
                    showAlert('No products found matching your search', 'info');
                } else {
                    displayAllProducts(filteredProducts);
                    showAlert(`Found ${filteredProducts.length} product(s)`, 'success');
                }
            } else {
                displayAllProducts(allProducts);
            }
        };
        
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Clear search when input is emptied
        searchInput.addEventListener('input', (e) => {
            if (e.target.value === '') {
                displayAllProducts(allProducts);
            }
        });
    }
}


// Update badge counts
function updateBadgeCounts() {
    const cartCount = document.getElementById('cart-count');
    const wishlistCount = document.getElementById('wishlist-count');
    
    if (cartCount) {
        cartCount.textContent = userCart.reduce((total, item) => total + item.quantity, 0);
    }
    
    if (wishlistCount) {
        wishlistCount.textContent = userWishlist.length;
    }
}



// Initialize User Interface
document.addEventListener('DOMContentLoaded', async function() {
    await checkAuthentication();
    protectDashboard();
    setupAuthModals();
    
    // Only load dashboard content if user is authenticated
    if (currentUser || !window.location.pathname.includes('user-interface.html')) {
        displayAllProducts();
        displayWishlist();
        displayCart();
        displayUserReviews();
        setupFilters();
        setupReviewForm();
        setupDirectMessageForm();
        setupCheckout();
        setupSearch();
        updateBadgeCounts();
    }
});



// Add CSS for alert animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }

    .form-group {
        position: relative;
    }
    
    .password-feedback {
        font-size: 0.8rem;
        margin-top: 5px;
        font-weight: 600;
        display: none;
    }
    
    .password-match {
        color: #27ae60;
    }
    
    .password-mismatch {
        color: #e74c3c;
    }
`;
document.head.appendChild(style);



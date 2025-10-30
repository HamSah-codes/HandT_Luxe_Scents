// Enhanced User Dashboard JavaScript - Only NEW features
// This works alongside your existing user.js

class UserDashboard {
    constructor() {
        this.currentTab = 'dashboard';
        this.currentUser = null;
        this.init();
    }

    async init() {
        await this.checkAuthentication();
        this.setupEventListeners();
        this.loadDashboardData();
        this.updateUI();
    }

    // Authentication check
    async checkAuthentication() {
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
                    this.currentUser = data.user;
                } else {
                    this.redirectToLogin();
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                if (savedUser) {
                    this.currentUser = JSON.parse(savedUser);
                } else {
                    this.redirectToLogin();
                }
            }
        } else {
            this.redirectToLogin();
        }
    }

    redirectToLogin() {
        showAlert('Please log in to access your dashboard', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    setupEventListeners() {
        // Tab navigation - NEW feature
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const tab = item.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Form submissions - NEW enhanced forms
        const profileForm = document.getElementById('profile-update-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => this.updateProfile(e));
        }

        const passwordForm = document.getElementById('password-change-form');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => this.changePassword(e));
        }

        const supportForm = document.getElementById('support-message-form');
        if (supportForm) {
            supportForm.addEventListener('submit', (e) => this.sendSupportMessage(e));
        }

        const addressForm = document.getElementById('add-address-form');
        if (addressForm) {
            addressForm.addEventListener('submit', (e) => this.addAddress(e));
        }

        // Modal handling
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.close-modal');

        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modals.forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });

        modals.forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    // NEW: Tab switching functionality
    switchTab(tabName) {
        // Update active tab in sidebar
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;

        // Load tab-specific data
        this.loadTabData(tabName);
    }

    async loadDashboardData() {
        await this.loadUserProfile();
        await this.loadUserStats();
        await this.loadRecentOrders();
        await this.loadRecentlyViewed();
    }

    async loadUserProfile() {
        if (!this.currentUser) return;

        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': sessionToken
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.populateProfileForm(data.user);
            }
        } catch (error) {
            console.error('Failed to load user profile:', error);
        }
    }

    populateProfileForm(userData) {
        document.getElementById('user-name').textContent = userData.fullName;
        document.getElementById('profile-fullname').value = userData.fullName || '';
        document.getElementById('profile-email').value = userData.email || '';
    }

    async loadUserStats() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            
            // Load orders count
            const ordersResponse = await fetch('/api/user/orders/count', {
                headers: {
                    'Authorization': sessionToken
                }
            });
            if (ordersResponse.ok) {
                const ordersData = await ordersResponse.json();
                document.getElementById('orders-count').textContent = ordersData.count || 0;
            }

            // Load wishlist count
            const wishlistResponse = await fetch('/api/wishlist', {
                headers: {
                    'Authorization': sessionToken
                }
            });
            if (wishlistResponse.ok) {
                const wishlistData = await wishlistResponse.json();
                document.getElementById('wishlist-total').textContent = wishlistData.total_items || 0;
            }

            // Load reviews count
            const reviewsResponse = await fetch('/api/user/reviews/count', {
                headers: {
                    'Authorization': sessionToken
                }
            });
            if (reviewsResponse.ok) {
                const reviewsData = await reviewsResponse.json();
                document.getElementById('reviews-count').textContent = reviewsData.count || 0;
            }

        } catch (error) {
            console.error('Failed to load user stats:', error);
        }
    }

    async loadRecentOrders() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/user/orders/recent', {
                headers: {
                    'Authorization': sessionToken
                }
            });

            const container = document.getElementById('recent-orders');
            if (!container) return;

            if (response.ok) {
                const orders = await response.json();
                this.displayRecentOrders(orders);
            } else {
                container.innerHTML = this.getEmptyOrdersHTML();
            }
        } catch (error) {
            console.error('Failed to load recent orders:', error);
            document.getElementById('recent-orders').innerHTML = this.getEmptyOrdersHTML();
        }
    }

    displayRecentOrders(orders) {
        const container = document.getElementById('recent-orders');
        
        if (!orders || orders.length === 0) {
            container.innerHTML = this.getEmptyOrdersHTML();
            return;
        }

        const ordersHTML = orders.slice(0, 3).map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <span class="order-id">Order #${order.id}</span>
                        <div class="order-date">${new Date(order.order_date).toLocaleDateString()}</div>
                    </div>
                    <span class="order-status status-${order.status}">${order.status}</span>
                </div>
                <div class="order-items">
                    ${order.items ? order.items.slice(0, 2).map(item => 
                        `<div>${item.product_name} x ${item.quantity}</div>`
                    ).join('') : ''}
                    ${order.items && order.items.length > 2 ? `<div>+${order.items.length - 2} more items</div>` : ''}
                </div>
                <div class="order-total">
                    Total: $${order.total_amount}
                </div>
            </div>
        `).join('');

        container.innerHTML = ordersHTML;
    }

    getEmptyOrdersHTML() {
        return `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <p>No recent orders</p>
                <a href="index.html#shop" class="btn btn-primary">Start Shopping</a>
            </div>
        `;
    }

    async loadRecentlyViewed() {
        // Implementation for recently viewed
        const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        const container = document.getElementById('recently-viewed');
        
        if (!container) return;

        if (recentlyViewed.length === 0) {
            container.innerHTML = '<p class="empty-message">No recently viewed products</p>';
            return;
        }
    }

    async loadTabData(tabName) {
        switch (tabName) {
            case 'orders':
                await this.loadAllOrders();
                break;
            case 'wishlist':
                await this.loadWishlist();
                break;
            case 'addresses':
                await this.loadAddresses();
                break;
            case 'reviews':
                await this.loadUserReviews();
                break;
        }
    }

    async loadAllOrders() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/user/orders', {
                headers: {
                    'Authorization': sessionToken
                }
            });

            const container = document.getElementById('orders-container');
            if (!container) return;

            if (response.ok) {
                const orders = await response.json();
                this.displayAllOrders(orders);
            } else {
                container.innerHTML = this.getEmptyOrdersHTML();
            }
        } catch (error) {
            console.error('Failed to load orders:', error);
            document.getElementById('orders-container').innerHTML = this.getEmptyOrdersHTML();
        }
    }

    displayAllOrders(orders) {
        const container = document.getElementById('orders-container');
        
        if (!orders || orders.length === 0) {
            container.innerHTML = this.getEmptyOrdersHTML();
            return;
        }

        const ordersHTML = orders.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <div>
                        <span class="order-id">Order #${order.id}</span>
                        <div class="order-date">${new Date(order.order_date).toLocaleDateString()}</div>
                    </div>
                    <span class="order-status status-${order.status}">${order.status}</span>
                </div>
                <div class="order-items">
                    ${order.items ? order.items.map(item => 
                        `<div>${item.product_name} x ${item.quantity} - $${item.price}</div>`
                    ).join('') : ''}
                </div>
                <div class="order-footer">
                    <div class="order-total">
                        Total: $${order.total_amount}
                    </div>
                    <div class="order-actions">
                        <button class="btn btn-secondary" onclick="trackOrder(${order.id})">Track Order</button>
                        <button class="btn btn-secondary" onclick="reorder(${order.id})">Reorder</button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = ordersHTML;
    }

    async loadWishlist() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/wishlist', {
                headers: {
                    'Authorization': sessionToken
                }
            });

            const container = document.getElementById('wishlist-container');
            if (!container) return;

            if (response.ok) {
                const wishlistData = await response.json();
                this.displayWishlist(wishlistData.wishlist_items);
            } else {
                container.innerHTML = this.getEmptyWishlistHTML();
            }
        } catch (error) {
            console.error('Failed to load wishlist:', error);
            document.getElementById('wishlist-container').innerHTML = this.getEmptyWishlistHTML();
        }
    }

    displayWishlist(wishlistItems) {
        const container = document.getElementById('wishlist-container');
        
        if (!wishlistItems || wishlistItems.length === 0) {
            container.innerHTML = this.getEmptyWishlistHTML();
            return;
        }

        const wishlistHTML = wishlistItems.map(item => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${item.image_url}" alt="${item.name}">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${item.name}</h3>
                    <p class="product-brand">${item.brand}</p>
                    <p class="product-price">$${item.price}</p>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart" data-id="${item.product_id}">Add to Cart</button>
                        <button class="btn btn-secondary remove-from-wishlist" data-id="${item.product_id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = wishlistHTML;
    }

    getEmptyWishlistHTML() {
        return `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <p>Your wishlist is empty</p>
                <a href="index.html#shop" class="btn btn-primary">Explore Products</a>
            </div>
        `;
    }

    async loadAddresses() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/user/addresses', {
                headers: {
                    'Authorization': sessionToken
                }
            });

            const container = document.getElementById('addresses-container');
            if (!container) return;

            if (response.ok) {
                const addresses = await response.json();
                this.displayAddresses(addresses);
            } else {
                container.innerHTML = this.getEmptyAddressesHTML();
            }
        } catch (error) {
            console.error('Failed to load addresses:', error);
            document.getElementById('addresses-container').innerHTML = this.getEmptyAddressesHTML();
        }
    }

    displayAddresses(addresses) {
        const container = document.getElementById('addresses-container');
        
        if (!addresses || addresses.length === 0) {
            container.innerHTML = this.getEmptyAddressesHTML();
            return;
        }

        const addressesHTML = addresses.map(address => `
            <div class="address-card ${address.is_default ? 'default' : ''}">
                <div class="address-header">
                    <span class="address-label">${address.label || 'Address'}</span>
                    ${address.is_default ? '<span class="default-badge">Default</span>' : ''}
                </div>
                <div class="address-details">
                    <p>${address.address_line1}</p>
                    ${address.address_line2 ? `<p>${address.address_line2}</p>` : ''}
                    <p>${address.city}, ${address.state} ${address.zip_code}</p>
                    <p>${address.country}</p>
                </div>
                <div class="address-actions">
                    <button class="btn btn-secondary" onclick="editAddress(${address.id})">Edit</button>
                    ${!address.is_default ? `<button class="btn btn-secondary" onclick="deleteAddress(${address.id})">Delete</button>` : ''}
                    ${!address.is_default ? `<button class="btn btn-secondary" onclick="setDefaultAddress(${address.id})">Set Default</button>` : ''}
                </div>
            </div>
        `).join('');

        container.innerHTML = addressesHTML;
    }

    getEmptyAddressesHTML() {
        return `
            <div class="empty-state">
                <i class="fas fa-address-book"></i>
                <p>No addresses saved</p>
                <p>Add your first address to make checkout easier</p>
            </div>
        `;
    }

    async loadUserReviews() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/user/reviews', {
                headers: {
                    'Authorization': sessionToken
                }
            });

            const container = document.getElementById('reviews-container');
            if (!container) return;

            if (response.ok) {
                const reviews = await response.json();
                this.displayUserReviews(reviews);
            } else {
                container.innerHTML = this.getEmptyReviewsHTML();
            }
        } catch (error) {
            console.error('Failed to load reviews:', error);
            document.getElementById('reviews-container').innerHTML = this.getEmptyReviewsHTML();
        }
    }

    displayUserReviews(reviews) {
        const container = document.getElementById('reviews-container');
        
        if (!reviews || reviews.length === 0) {
            container.innerHTML = this.getEmptyReviewsHTML();
            return;
        }

        const reviewsHTML = reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <span class="review-product">${review.product_name}</span>
                    <span class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
                </div>
                <p class="review-text">${review.comment}</p>
                <div class="review-date">${new Date(review.created_at).toLocaleDateString()}</div>
                <div class="review-actions">
                    <button class="btn btn-secondary" onclick="editReview(${review.id})">Edit</button>
                    <button class="btn btn-secondary" onclick="deleteReview(${review.id})">Delete</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = reviewsHTML;
    }

    getEmptyReviewsHTML() {
        return `
            <div class="empty-state">
                <i class="fas fa-star"></i>
                <p>No reviews yet</p>
                <p>Share your thoughts on products you've purchased</p>
            </div>
        `;
    }

    // NEW: Enhanced form submissions
    async updateProfile(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const profileData = {
            fullName: formData.get('fullname'),
            phone: formData.get('phone'),
            birthdate: formData.get('birthdate'),
            newsletter: formData.get('newsletter') === 'on'
        };

        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': sessionToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });

            if (response.ok) {
                showAlert('Profile updated successfully!', 'success');
                document.getElementById('user-name').textContent = profileData.fullName;
            } else {
                showAlert('Failed to update profile', 'error');
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            showAlert('Failed to update profile', 'error');
        }
    }

    async changePassword(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const passwordData = {
            currentPassword: formData.get('current_password'),
            newPassword: formData.get('new_password')
        };

        if (formData.get('new_password') !== formData.get('confirm_password')) {
            showAlert('New passwords do not match', 'error');
            return;
        }

        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: {
                    'Authorization': sessionToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(passwordData)
            });

            if (response.ok) {
                showAlert('Password updated successfully!', 'success');
                e.target.reset();
            } else {
                const data = await response.json();
                showAlert(data.error || 'Failed to update password', 'error');
            }
        } catch (error) {
            console.error('Failed to change password:', error);
            showAlert('Failed to update password', 'error');
        }
    }

    async sendSupportMessage(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const messageData = {
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/support/messages', {
                method: 'POST',
                headers: {
                    'Authorization': sessionToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });

            if (response.ok) {
                showAlert('Message sent successfully! We will get back to you soon.', 'success');
                e.target.reset();
            } else {
                showAlert('Failed to send message', 'error');
            }
        } catch (error) {
            console.error('Failed to send support message:', error);
            showAlert('Failed to send message', 'error');
        }
    }

    async addAddress(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const addressData = {
            label: formData.get('label'),
            address_line1: formData.get('line1'),
            address_line2: formData.get('line2'),
            city: formData.get('city'),
            state: formData.get('state'),
            zip_code: formData.get('zip'),
            country: formData.get('country'),
            is_default: formData.get('default') === 'on'
        };

        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/user/addresses', {
                method: 'POST',
                headers: {
                    'Authorization': sessionToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addressData)
            });

            if (response.ok) {
                showAlert('Address added successfully!', 'success');
                this.closeAddAddressForm();
                this.loadAddresses();
            } else {
                showAlert('Failed to add address', 'error');
            }
        } catch (error) {
            console.error('Failed to add address:', error);
            showAlert('Failed to add address', 'error');
        }
    }

    showAddAddressForm() {
        document.getElementById('add-address-modal').style.display = 'block';
    }

    closeAddAddressForm() {
        document.getElementById('add-address-modal').style.display = 'none';
        document.getElementById('add-address-form').reset();
    }

    updateUI() {
        if (this.currentUser) {
            this.populateProfileForm(this.currentUser);
        }
    }
}

// Global functions for HTML onclick handlers
function switchTab(tabName) {
    if (window.userDashboard) {
        window.userDashboard.switchTab(tabName);
    }
}

function showAddAddressForm() {
    if (window.userDashboard) {
        window.userDashboard.showAddAddressForm();
    }
}

function closeAddAddressForm() {
    if (window.userDashboard) {
        window.userDashboard.closeAddAddressForm();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.userDashboard = new UserDashboard();
});

// Helper functions
function trackOrder(orderId) {
    showAlert(`Tracking order #${orderId}`, 'info');
}

function reorder(orderId) {
    showAlert(`Reordering order #${orderId}`, 'info');
}

function editAddress(addressId) {
    showAlert(`Editing address #${addressId}`, 'info');
}

function deleteAddress(addressId) {
    if (confirm('Are you sure you want to delete this address?')) {
        showAlert(`Deleting address #${addressId}`, 'info');
    }
}

function setDefaultAddress(addressId) {
    showAlert(`Setting address #${addressId} as default`, 'info');
}

function editReview(reviewId) {
    showAlert(`Editing review #${reviewId}`, 'info');
}

function deleteReview(reviewId) {
    if (confirm('Are you sure you want to delete this review?')) {
        showAlert(`Deleting review #${reviewId}`, 'info');
    }
}

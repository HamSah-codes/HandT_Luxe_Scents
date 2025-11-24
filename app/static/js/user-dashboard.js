class UserDashboard {
    constructor() {
        this.currentUser = null;
        this.cartItems = [];
        this.wishlistItems = [];
        this.orders = [];
        this.init();
    }

    async init() {
        await this.checkAuth();
        this.setupNavigation();
        this.setupEventListeners();
        this.loadUserData();
    }

    async checkAuth() {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) {
            this.redirectToLogin();
            return;
        }

        try {
            // Get user data from localStorage
            const userData = this.getUserFromSession();
            if (userData) {
                this.currentUser = userData;
                this.updateUserUI();
                return;
            }

            // If no user data found, redirect to login
            this.redirectToLogin();
            
        } catch (error) {
            console.error('Auth check failed:', error);
            this.redirectToLogin();
        }
    }

    getUserFromSession() {
        const sessionToken = localStorage.getItem('sessionToken');
        if (!sessionToken) return null;

        // Try to get stored user data
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            try {
                return JSON.parse(storedUserData);
            } catch (e) {
                console.error('Error parsing stored user data:', e);
            }
        }

        // Fallback to demo data
        if (sessionToken.startsWith('demo-token-')) {
            return {
                id: 1,
                fullName: 'Demo User', 
                email: 'demo@htluxescents.com',
                username: 'demo'
            };
        }
        
        return null;
    }

    redirectToLogin() {
        if (window.app) {
            window.app.showModal('login-modal');
        } else {
            window.location.href = '/';
        }
    }

    updateUserUI() {
        if (this.currentUser) {
            console.log('Updating UI with user:', this.currentUser);
            
            // Update avatar
            const avatar = document.getElementById('user-avatar');
            if (avatar) {
                const initials = this.currentUser.fullName
                    .split(' ')
                    .map(name => name[0])
                    .join('')
                    .toUpperCase();
                avatar.textContent = initials;
            }

            // Update user info
            const fullNameElement = document.getElementById('user-fullname');
            const emailElement = document.getElementById('user-email');
            
            if (fullNameElement) {
                fullNameElement.textContent = this.currentUser.fullName;
            }
            if (emailElement) {
                emailElement.textContent = this.currentUser.email;
            }

            // Update form fields
            const profileName = document.getElementById('profile-name');
            const profileEmail = document.getElementById('profile-email');
            
            if (profileName) {
                profileName.value = this.currentUser.fullName;
            }
            if (profileEmail) {
                profileEmail.value = this.currentUser.email;
            }
        } else {
            console.error('No user data available');
            this.redirectToLogin();
        }
    }

    setupNavigation() {
        // Navigation tabs
        const navItems = document.querySelectorAll('.user-nav-item[data-section]');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all items
                navItems.forEach(navItem => navItem.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
                
                // Show corresponding section
                const sectionId = item.getAttribute('data-section');
                this.showSection(sectionId);
            });
        });

        // Set initial active section based on URL hash
        const hash = window.location.hash.substring(1);
        if (hash && document.querySelector(`[data-section="${hash}"]`)) {
            const targetItem = document.querySelector(`[data-section="${hash}"]`);
            targetItem.click();
        } else {
            // Default to profile section
            this.showSection('profile');
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Load section data
            this.loadSectionData(sectionId);
        }
    }

    loadSectionData(sectionId) {
        switch (sectionId) {
            case 'cart':
                this.loadCart();
                break;
            case 'wishlist':
                this.loadWishlist();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'profile':
                this.loadProfile();
                break;
        }
    }

    setupEventListeners() {
        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.updateProfile();
            });
        }

        // Clear wishlist button
        const clearWishlistBtn = document.getElementById('clear-wishlist-btn');
        if (clearWishlistBtn) {
            clearWishlistBtn.addEventListener('click', () => {
                this.clearWishlist();
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.proceedToCheckout();
            });
        }
    }

    async updateProfile() {
        const formData = new FormData(document.getElementById('profile-form'));
        const data = {
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            address: formData.get('address')
        };

        try {
            // Simulate API call - replace with actual API
            this.currentUser.fullName = data.fullName;
            this.currentUser.phone = data.phone;
            this.currentUser.address = data.address;
            
            // Update localStorage
            localStorage.setItem('userData', JSON.stringify(this.currentUser));
            
            this.showAlert('Profile updated successfully!', 'success');
            this.updateUserUI();
            
            // Update main app if available
            if (window.app && window.app.currentUser) {
                window.app.currentUser.fullName = data.fullName;
                window.app.updateAuthUI();
            }
            
        } catch (error) {
            console.error('Update profile error:', error);
            this.showAlert('Error updating profile', 'error');
        }
    }

    async loadOrders() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/orders', {
                headers: {
                    'Authorization': sessionToken
                }
            });

            if (response.ok) {
                const orders = await response.json();
                const ordersList = document.getElementById('orders-list');
                
                if (orders.length === 0) {
                    ordersList.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-box-open"></i>
                            <h3>No Orders Yet</h3>
                            <p>You haven't placed any orders yet.</p>
                            <a href="/shop" class="shop-now-btn">Start Shopping</a>
                        </div>
                    `;
                } else {
                    ordersList.innerHTML = orders.map(order => `
                        <div class="order-item">
                            <div class="order-header">
                                <div class="order-number">Order #${order.order_number}</div>
                                <div class="order-date">${new Date(order.created_at).toLocaleDateString()}</div>
                                <div class="order-status status-${order.status}">${order.status}</div>
                            </div>
                            <div class="order-details">
                                <div class="order-items">${order.items.length} items</div>
                                <div class="order-total">GH₵${order.total_amount}</div>
                            </div>
                            <div class="order-actions">
                                <button class="view-order-btn" onclick="userDashboard.viewOrder(${order.id})">
                                    View Details
                                </button>
                                ${order.status === 'pending' ? `
                                    <button class="cancel-order-btn" onclick="userDashboard.cancelOrder(${order.id})">
                                        Cancel Order
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('');
                }
            }
        } catch (error) {
            console.error('Load orders error:', error);
            document.getElementById('orders-list').innerHTML = '<p>Error loading orders. Please try again.</p>';
        }
    }

    async loadWishlist() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/wishlist', {
                headers: {
                    'Authorization': sessionToken
                }
            });

            if (response.ok) {
                const wishlistItems = await response.json();
                const wishlistGrid = document.getElementById('wishlist-grid');
                const clearBtn = document.getElementById('clear-wishlist-btn');
                
                // Update badge count
                document.querySelectorAll('.wishlist-count-badge').forEach(badge => {
                    badge.textContent = wishlistItems.length;
                });

                if (wishlistItems.length === 0) {
                    wishlistGrid.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-heart"></i>
                            <h3>Your Wishlist is Empty</h3>
                            <p>Start adding products you love to your wishlist.</p>
                            <a href="/shop" class="shop-now-btn">Explore Products</a>
                        </div>
                    `;
                    if (clearBtn) clearBtn.style.display = 'none';
                } else {
                    wishlistGrid.innerHTML = wishlistItems.map(item => `
                        <div class="wishlist-item">
                            <button class="wishlist-remove" onclick="userDashboard.removeFromWishlist(${item.product_id})">
                                <i class="fas fa-times"></i>
                            </button>
                            <img src="${item.image_url || '/static/assets/img/placeholder.jpg'}" 
                                alt="${item.name}"
                                onerror="this.src='/static/assets/img/placeholder.jpg'">
                            <div class="wishlist-item-info">
                                <h4>${item.name}</h4>
                                <p>${item.brand}</p>
                                <div class="wishlist-price">GH₵${item.price}</div>
                                <div class="wishlist-actions">
                                    <button class="move-to-cart" onclick="userDashboard.moveToCart(${item.product_id})">
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('');
                    if (clearBtn) clearBtn.style.display = 'block';
                }
            }
        } catch (error) {
            console.error('Load wishlist error:', error);
            document.getElementById('wishlist-grid').innerHTML = '<p>Error loading wishlist. Please try again.</p>';
        }
    }

    async loadCart() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/cart', {
                headers: {
                    'Authorization': sessionToken
                }
            });

            if (response.ok) {
                const cartData = await response.json();
                const cartItems = document.getElementById('cart-items');
                const cartSummary = document.getElementById('cart-summary');
                
                // Update badge count
                document.querySelectorAll('.cart-count-badge').forEach(badge => {
                    badge.textContent = cartData.item_count || '0';
                });

                if (!cartData.items || cartData.items.length === 0) {
                    cartItems.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-shopping-bag"></i>
                            <h3>Your Cart is Empty</h3>
                            <p>Add some products to your cart to see them here.</p>
                            <a href="/shop" class="shop-now-btn">Continue Shopping</a>
                        </div>
                    `;
                    if (cartSummary) cartSummary.style.display = 'none';
                } else {
                    cartItems.innerHTML = cartData.items.map(item => `
                        <div class="cart-item">
                            <img src="${item.image_url || '/static/assets/img/placeholder.jpg'}" 
                                alt="${item.name}"
                                onerror="this.src='/static/assets/img/placeholder.jpg'">
                            <div class="item-details">
                                <h4>${item.name}</h4>
                                <p>${item.brand}</p>
                                <div class="price">GH₵${item.price}</div>
                            </div>
                            <div class="item-controls">
                                <div class="quantity-controls">
                                    <button onclick="userDashboard.updateCartQuantity(${item.product_id}, ${item.quantity - 1})">-</button>
                                    <span>${item.quantity}</span>
                                    <button onclick="userDashboard.updateCartQuantity(${item.product_id}, ${item.quantity + 1})">+</button>
                                </div>
                                <button class="remove-btn" onclick="userDashboard.removeFromCart(${item.product_id})">
                                    Remove
                                </button>
                            </div>
                            <div class="item-total">GH₵${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `).join('');

                    if (cartSummary) {
                        document.getElementById('cart-total-amount').textContent = `GH₵${cartData.total.toFixed(2)}`;
                        cartSummary.style.display = 'flex';
                    }
                }
            }
        } catch (error) {
            console.error('Load cart error:', error);
            document.getElementById('cart-items').innerHTML = '<p>Error loading cart. Please try again.</p>';
        }
    }

    async cancelOrder(orderId) {
        if (!confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch(`/api/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': sessionToken
                }
            });

            if (response.ok) {
                this.showAlert('Order cancelled successfully', 'success');
                this.loadOrders(); // Reload orders
            } else {
                this.showAlert('Failed to cancel order', 'error');
            }
        } catch (error) {
            console.error('Cancel order error:', error);
            this.showAlert('Error cancelling order', 'error');
        }
    }

    async proceedToCheckout() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Authorization': sessionToken
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.showAlert('Order placed successfully!', 'success');
                
                // Clear cart and reload
                this.loadCart();
                this.loadOrders();
                
                // Redirect to order confirmation if needed
                if (data.order_id) {
                    setTimeout(() => {
                        this.viewOrder(data.order_id);
                    }, 2000);
                }
            } else {
                this.showAlert('Checkout failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            this.showAlert('Error during checkout', 'error');
        }
    }

    loadProfile() {
        // Profile is already loaded in updateUserUI()
        console.log('Profile section loaded');
    }

    async removeFromWishlist(productId) {
        try {
            // Simulate API call - replace with actual API
            this.showAlert('Product removed from wishlist', 'success');
            this.loadWishlist(); // Reload to show updated list
            
            // Update main app wishlist count if available
            if (window.app) {
                window.app.updateWishlistCount();
            }
        } catch (error) {
            console.error('Remove from wishlist error:', error);
            this.showAlert('Error removing from wishlist', 'error');
        }
    }

    async clearWishlist() {
        if (!confirm('Are you sure you want to clear your entire wishlist?')) {
            return;
        }

        try {
            // Simulate API call - replace with actual API
            this.showAlert('Wishlist cleared successfully', 'success');
            this.wishlistItems = [];
            this.loadWishlist();
            
            if (window.app) {
                window.app.updateWishlistCount();
            }
        } catch (error) {
            console.error('Clear wishlist error:', error);
            this.showAlert('Error clearing wishlist', 'error');
        }
    }

    async moveToCart(productId) {
        try {
            // Simulate moving to cart
            this.showAlert('Product moved to cart', 'success');
            await this.removeFromWishlist(productId);
            this.loadCart(); // Reload cart to show the moved item
        } catch (error) {
            console.error('Move to cart error:', error);
            this.showAlert('Error moving product to cart', 'error');
        }
    }

    async removeFromCart(productId) {
        try {
            // Simulate API call - replace with actual API
            this.showAlert('Product removed from cart', 'success');
            this.loadCart(); // Reload to show updated cart
            
            // Update main app cart count if available
            if (window.app) {
                window.app.updateCartCount();
            }
        } catch (error) {
            console.error('Remove from cart error:', error);
            this.showAlert('Error removing from cart', 'error');
        }
    }

    async updateCartQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            await this.removeFromCart(productId);
            return;
        }

        try {
            // Simulate API call - replace with actual API
            this.showAlert('Quantity updated', 'success');
            this.loadCart(); // Reload to show updated quantities
            
            if (window.app) {
                window.app.updateCartCount();
            }
        } catch (error) {
            console.error('Update cart quantity error:', error);
            this.showAlert('Error updating quantity', 'error');
        }
    }

    proceedToCheckout() {
        // Simulate checkout process
        this.showAlert('Proceeding to checkout...', 'info');
        // In a real app, this would redirect to checkout page
        setTimeout(() => {
            this.showAlert('Checkout functionality would be implemented here!', 'success');
        }, 1000);
    }

    viewOrder(orderId) {
        this.showAlert(`Viewing order details for order #${orderId}`, 'info');
        // Implement order details view modal or page
    }

    logout() {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('userData');
        this.showAlert('Logged out successfully', 'success');
        
        setTimeout(() => {
            window.location.href = '/';
        }, 1500);
    }

    showAlert(message, type = 'info') {
        // Use main app's alert system if available, otherwise use simple alert
        if (window.app) {
            window.app.showAlert(message, type);
        } else {
            // Simple fallback alert
            const alertDiv = document.createElement('div');
            alertDiv.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                z-index: 3000;
                background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ffc107' : '#17a2b8'};
            `;
            alertDiv.textContent = message;
            document.body.appendChild(alertDiv);
            
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
            }, 5000);
        }
    }

    loadUserData() {
        // Load all user data
        this.loadOrders();
        this.loadWishlist();
        this.loadCart();
    }
}

// Global functions
function resetProfileForm() {
    if (window.userDashboard && window.userDashboard.currentUser) {
        document.getElementById('profile-name').value = window.userDashboard.currentUser.fullName;
        document.getElementById('profile-phone').value = window.userDashboard.currentUser.phone || '';
        document.getElementById('profile-address').value = window.userDashboard.currentUser.address || '';
    }
}

// Initialize user dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.userDashboard = new UserDashboard();
});
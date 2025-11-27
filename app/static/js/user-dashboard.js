class UserDashboard {
    constructor() {
        this.currentUser = null;
        this.cartItems = [];
        this.wishlistItems = [];
        this.orders = [];
        this.isLoading = false;
        // Track loaded sections to prevent repeated API calls
        this.loadedSections = new Set();
        this.lastApiCall = {};
        this.init();
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    async init() {
        await this.checkAuth();
        this.setupNavigation();
        this.setupEventListeners();
        this.debouncedLoadCart = this.debounce(() => this.loadCart(), 300);
        this.debouncedLoadWishlist = this.debounce(() => this.loadWishlist(), 300);
        this.debouncedLoadOrders = this.debounce(() => this.loadOrders(), 300);
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

            // Update dashboard welcome message
            const welcomeTitle = document.getElementById('dashboard-welcome');
            if (welcomeTitle) {
                // Get first name only for a more personal greeting
                const firstName = this.currentUser.fullName.split(' ')[0];
                welcomeTitle.textContent = `Welcome, ${firstName}!`;
            }

            // Update form fields
            const profileName = document.getElementById('profile-name');
            const profileEmail = document.getElementById('profile-email');
            const profilePhone = document.getElementById('profile-phone');
            const profileAddress = document.getElementById('profile-address');
            
            if (profileName) {
                profileName.value = this.currentUser.fullName;
            }
            if (profileEmail) {
                profileEmail.value = this.currentUser.email;
            }
            if (profilePhone) {
                profilePhone.value = this.currentUser.phone || '';
            }
            if (profileAddress) {
                profileAddress.value = this.currentUser.address || '';
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

        // Remove active class from all nav items
        document.querySelectorAll('.user-nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionId}-section`);
        if (targetSection) {
            targetSection.classList.add('active');

            // Add active class to corresponding nav item
            const targetNavItem = document.querySelector(`[data-section="${sectionId}"]`);
            if (targetNavItem) {
                targetNavItem.classList.add('active');
            }
            
            // Update URL hash
            window.location.hash = sectionId;
            
            if (!this.loadedSections.has(sectionId)) {
                this.loadSectionData(sectionId);
                this.loadedSections.add(sectionId);
            }
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

    async loadInitialCounts() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            
            // Load wishlist count
            const wishlistResponse = await fetch('/api/wishlist', {
                headers: { 'Authorization': sessionToken }
            });
            
            if (wishlistResponse.ok) {
                const wishlistItems = await wishlistResponse.json();
                this.updateSidebarWishlistCount(wishlistItems.length);
            }
            
            // Load cart count (for consistency)
            const cartResponse = await fetch('/api/cart', {
                headers: { 'Authorization': sessionToken }
            });
            
            if (cartResponse.ok) {
                const cartData = await cartResponse.json();
                this.updateSidebarCartCount(cartData.item_count || 0);
            }
            
        } catch (error) {
            console.error('Load initial counts error:', error);
        }
    }

    updateSidebarWishlistCount(count) {
        // Update the sidebar wishlist counter specifically
        const sidebarWishlistCounter = document.querySelector('.user-nav-item[data-section="wishlist"] .count-badge, .user-nav-item[data-section="wishlist"] .wishlist-count-badge');
        if (sidebarWishlistCounter) {
            sidebarWishlistCounter.textContent = count;
            console.log(`❤️ Sidebar wishlist counter updated to: ${count}`);
        } else {
            console.log('❌ Sidebar wishlist counter element not found');
            // Let's check what elements exist for debugging
            const navItems = document.querySelectorAll('.user-nav-item[data-section="wishlist"] *');
            console.log('Wishlist nav item children:', navItems);
        }
    }

    updateSidebarCartCount(count) {
        // Update the sidebar cart counter specifically
        const sidebarCartCounter = document.querySelector('.user-nav-item[data-section="cart"] .count-badge, .user-nav-item[data-section="cart"] .cart-count-badge');
        if (sidebarCartCounter) {
            sidebarCartCounter.textContent = count;
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
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionToken
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                this.currentUser = result.user;
                
                // Update localStorage with new user data
                localStorage.setItem('userData', JSON.stringify(this.currentUser));
                
                this.showAlert('Profile updated successfully!', 'success');
                this.updateUserUI();
                
                // Update main app if available
                if (window.app && window.app.currentUser) {
                    window.app.currentUser = this.currentUser;
                    window.app.updateAuthUI();
                }
            } else {
                const error = await response.json();
                this.showAlert(error.error || 'Error updating profile', 'error');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            this.showAlert('Error updating profile', 'error');
        }
    }

    async loadOrders() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            console.log('🔍 Loading orders...');

            const response = await fetch('/api/orders', {
                headers: {
                    'Authorization': sessionToken
                }
            });

            console.log('🔍 Orders API response status:', response.status);

            if (response.ok) {
                const orders = await response.json();
                console.log('🔍 Orders data received:', orders);
                
                const ordersList = document.getElementById('orders-list');
                
                if (!orders || orders.length === 0) {
                    console.log('🔍 No orders found in response');
                    ordersList.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-box-open"></i>
                            <h3>No Orders Yet</h3>
                            <p>You haven't placed any orders yet.</p>
                            <a href="/shop" class="shop-now-btn">Start Shopping</a>
                        </div>
                    `;
                } else {
                    console.log(`🔍 Rendering ${orders.length} orders`);
                    ordersList.innerHTML = orders.map(order => {
                        console.log('🔍 Processing order:', order);
                        return `
                            <div class="order-item">
                                <div class="order-header">
                                    <div class="order-number">Order #${order.order_number}</div>
                                    <div class="order-date">${new Date(order.created_at).toLocaleDateString()}</div>
                                    <div class="order-status status-${order.status}">${order.status}</div>
                                </div>
                                <div class="order-details">
                                    <div class="order-items">${order.item_count || 'Unknown'} items</div>
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
                        `;
                    }).join('');
                }
            } else {
                const errorText = await response.text();
                console.error('❌ Orders API error:', response.status, errorText);
                document.getElementById('orders-list').innerHTML = `
                    <div class="error-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>API Error ${response.status}</h3>
                        <p>${errorText}</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('❌ Load orders error:', error);
            document.getElementById('orders-list').innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Connection Error</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }


    async viewOrder(orderId) {
        try {
            console.log(`🔍 Viewing order details for: ${orderId}`);
            
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch(`/api/orders/${orderId}`, {
                headers: { 'Authorization': sessionToken }
            });

            if (response.ok) {
                const orderData = await response.json();
                this.showOrderDetailsModal(orderData);
            } else {
                this.showAlert('Failed to load order details', 'error');
            }
        } catch (error) {
            console.error('View order error:', error);
            this.showAlert('Error loading order details', 'error');
        }
    }

    showOrderDetailsModal(orderData) {
        const { order, items } = orderData;
        
        const modalHTML = `
        <div id="order-details-modal" class="modal" style="display: block;">
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h2>Order Details</h2>
                    <button class="close-modal">&times;</button>
                </div>
                
                <div class="order-details-content">
                    <!-- Order Summary -->
                    <div class="order-summary-section">
                        <h3>Order Information</h3>
                        <div class="order-info-grid">
                            <div class="order-info-item">
                                <strong>Order Number:</strong>
                                <span>${order.order_number}</span>
                            </div>
                            <div class="order-info-item">
                                <strong>Order Date:</strong>
                                <span>${new Date(order.created_at).toLocaleString()}</span>
                            </div>
                            <div class="order-info-item">
                                <strong>Status:</strong>
                                <span class="order-status status-${order.status}">${order.status}</span>
                            </div>
                            <div class="order-info-item">
                                <strong>Total Amount:</strong>
                                <span class="order-total">GH₵${order.total_amount}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Shipping Information -->
                    <div class="shipping-section">
                        <h3>Shipping Information</h3>
                        <div class="shipping-address">
                            <p><strong>Shipping Address:</strong></p>
                            <p>${order.shipping_address || 'Not specified'}</p>
                        </div>
                        ${order.customer_notes ? `
                        <div class="order-notes">
                            <p><strong>Order Notes:</strong></p>
                            <p>${order.customer_notes}</p>
                        </div>
                        ` : ''}
                    </div>

                    <!-- Order Items -->
                    <div class="order-items-section">
                        <h3>Order Items (${items.length})</h3>
                        <div class="order-items-list">
                            ${items.map(item => `
                            <div class="order-item-detail">
                                <div class="item-image">
                                    <img src="${item.image_url || '/static/assets/img/placeholder.jpg'}" 
                                        alt="${item.name}"
                                        onerror="this.src='/static/assets/img/placeholder.jpg'">
                                </div>
                                <div class="item-info">
                                    <h4>${item.name}</h4>
                                    <p class="item-brand">${item.brand}</p>
                                    <div class="item-quantity-price">
                                        <span class="quantity">Qty: ${item.quantity}</span>
                                        <span class="price">GH₵${item.unit_price} each</span>
                                    </div>
                                </div>
                                <div class="item-total">
                                    GH₵${(item.unit_price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Order Total -->
                    <div class="order-total-section">
                        <div class="order-total-line">
                            <strong>Total:</strong>
                            <strong class="total-amount">GH₵${order.total_amount}</strong>
                        </div>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        Close
                    </button>
                    ${order.status === 'pending' ? `
                    <button class="btn btn-danger" onclick="userDashboard.cancelOrder(${order.id})">
                        Cancel Order
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
        `;

        // Remove existing modal
        const existingModal = document.getElementById('order-details-modal');
        if (existingModal) existingModal.remove();
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Setup event listeners
        this.setupOrderDetailsModalEvents();
    }

    setupOrderDetailsModalEvents() {
        const modal = document.getElementById('order-details-modal');
        const closeBtn = modal.querySelector('.close-modal');
        
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
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


                // Update sidebar counter specifically
                this.updateSidebarWishlistCount(wishlistItems.length);
                
                // Update other wishlist badges
                document.querySelectorAll('.wishlist-count-badge:not(.user-nav-item .wishlist-count-badge)').forEach(badge => {
                    badge.textContent = wishlistItems.length;
                });
                
                // Update ALL wishlist count badges - INCLUDING SIDEBAR
                this.updateWishlistBadges(wishlistItems.length); // Add this line
                this.renderWishlistGrid(wishlistItems);

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
                                        <i class="fas fa-shopping-cart"></i> Add to Cart
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

    // Add this new method to update all wishlist badges
    updateWishlistBadges(count) {
        // Update ALL wishlist count elements throughout the entire page
        document.querySelectorAll('.wishlist-count, .wishlist-count-badge, [data-wishlist-count]').forEach(el => {
            el.textContent = count;
        });
        
        // Also update the specific sidebar counter in user dashboard
        const sidebarWishlistCounter = document.querySelector('.user-nav-item[data-section="wishlist"] .count-badge');
        if (sidebarWishlistCounter) {
            sidebarWishlistCounter.textContent = count;
        }
        
        console.log(`❤️ All wishlist badges updated to: ${count}`);
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

                        const checkoutBtn = document.getElementById('checkout-btn');
                        if (checkoutBtn) {
                            checkoutBtn.onclick = () => this.proceedToCheckout();
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Load cart error:', error);
            document.getElementById('cart-items').innerHTML = '<p>Error loading cart. Please try again.</p>';
        }
    }

    async cancelOrder(orderId) {
    // Create a confirmation modal
    const confirmationModal = `
        <div id="cancel-confirmation-modal" class="modal" style="display: block;">
            <div class="modal-content cancel-confirmation-modal">
                <h3>Cancel Order?</h3>
                <p>Are you sure you want to cancel this order? This action cannot be undone.</p>
                <div class="cancel-modal-actions">
                    <button class="confirm-cancel-btn" onclick="userDashboard.confirmCancelOrder(${orderId})">
                        Yes, Cancel Order
                    </button>
                    <button class="cancel-cancel-btn" onclick="document.getElementById('cancel-confirmation-modal').remove()">
                        No, Keep Order
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('cancel-confirmation-modal');
    if (existingModal) existingModal.remove();
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', confirmationModal);
}

async confirmCancelOrder(orderId) {
    try {
        const sessionToken = localStorage.getItem('sessionToken');
        console.log(`🗑️ Cancelling order ${orderId}...`);
        
        const response = await fetch(`/api/orders/${orderId}/cancel`, {
            method: 'POST',
            headers: {
                'Authorization': sessionToken,
                'Content-Type': 'application/json'
            }
        });

        // Remove confirmation modal
        const modal = document.getElementById('cancel-confirmation-modal');
        if (modal) modal.remove();

        if (response.ok) {
            const result = await response.json();
            console.log('✅ Order cancelled:', result);
            
            this.showAlert('Order cancelled successfully', 'success');
            this.loadOrders(); // Reload orders to reflect changes
            
            // Close order details modal if open
            const orderDetailsModal = document.getElementById('order-details-modal');
            if (orderDetailsModal) orderDetailsModal.remove();
            
        } else {
            const error = await response.json();
            console.error('❌ Cancel order failed:', error);
            this.showAlert(error.error || 'Failed to cancel order', 'error');
        }
    } catch (error) {
        console.error('❌ Cancel order error:', error);
        this.showAlert('Error cancelling order: ' + error.message, 'error');
    }
}

    async proceedToCheckout() {
        try {
            console.log('Proceed to checkout clicked');
        // First, check if cart has items
        const sessionToken = localStorage.getItem('sessionToken');
        const response = await fetch('/api/cart', {
            headers: {
                'Authorization': sessionToken
            }
        });

        if (response.ok) {
            const cartData = await response.json();
            console.log('Cart data:', cartData);
            
            if (!cartData.items || cartData.items.length === 0) {
                this.showAlert('Your cart is empty!', 'error');
                return;
            }

            // Show checkout modal
            this.showCheckoutModal();
        } else {
            this.showAlert('Failed to load cart data', 'error');
        }
    } catch (error) {
        console.error('Checkout preparation error:', error);
        this.showAlert('Error preparing checkout', 'error');
    }
}

    showCheckoutModal() {
        const modalHTML = `
        <div id="checkout-modal" class="modal" style="display: block;">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h2>Checkout</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <form id="checkout-form">
                    <div class="form-group">
                        <label for="checkout-phone">Phone Number (WhatsApp)</label>
                        <input type="tel" id="checkout-phone" required 
                            placeholder="+233 XX XXX XXXX"
                            value="${this.currentUser.phone || ''}">
                        <small style="color: var(--charcoal); font-size: 0.8rem;">
                            ${this.currentUser.phone ? 'Prefilled from your profile' : 'Save this in your profile to pre-fill future orders'}
                        </small>
                    </div>
                    
                    <div class="form-group">
                        <label for="checkout-address">Shipping Address</label>
                        <textarea id="checkout-address" required 
                                placeholder="Enter your complete shipping address"
                                rows="4">${this.currentUser.address || ''}</textarea>
                        <small style="color: var(--charcoal); font-size: 0.8rem;">
                            ${this.currentUser.address ? 'Prefilled from your profile' : 'Save your address in profile to avoid re-entering'}
                        </small>
                    </div>
                    
                    <div class="form-group">
                        <label for="checkout-notes">Order Notes (Optional)</label>
                        <textarea id="checkout-notes" 
                                placeholder="Any special instructions..."
                                rows="3"></textarea>
                    </div>
                    
                    <div class="checkout-summary">
                        <h3>Order Summary</h3>
                        <div id="checkout-items"></div>
                        <div class="checkout-total">
                            <strong>Total: <span id="checkout-total-amount">GH₵0.00</span></strong>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-large">
                        Place Order & Send WhatsApp
                    </button>
                </form>
            </div>
        </div>
        `;
        
        // Remove existing modal
        const existingModal = document.getElementById('checkout-modal');
        if (existingModal) existingModal.remove();
        
        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Load cart items into summary
        this.loadCheckoutSummary();
        
        // Setup event listeners
        this.setupCheckoutModalEvents();
    }

    async loadCheckoutSummary() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/cart', {
                headers: { 'Authorization': sessionToken }
            });
            
            if (response.ok) {
                const cartData = await response.json();
                const itemsContainer = document.getElementById('checkout-items');
                const totalAmount = document.getElementById('checkout-total-amount');
                
                itemsContainer.innerHTML = cartData.items.map(item => `
                    <div class="checkout-item" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>GH₵${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('');
                
                totalAmount.textContent = `GH₵${cartData.total.toFixed(2)}`;
            }
        } catch (error) {
            console.error('Load checkout summary error:', error);
        }
    }

    setupCheckoutModalEvents() {
        const modal = document.getElementById('checkout-modal');
        const form = document.getElementById('checkout-form');
        const closeBtn = modal.querySelector('.close-modal');
        
        // Close modal
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
        
        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.processCheckout();
        });
    }

    async processCheckout() {
        const phone = document.getElementById('checkout-phone').value;
        const address = document.getElementById('checkout-address').value;
        const notes = document.getElementById('checkout-notes').value;
        
        if (!phone || !address) {
            this.showAlert('Phone and shipping address are required', 'error');
            return;
        }
        
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionToken
                },
                body: JSON.stringify({
                    phone: phone,
                    shipping_address: address,
                    customer_notes: notes
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                this.showAlert(`Order placed successfully! ${result.notification}`, 'success');
                
                // Close modal
                document.getElementById('checkout-modal').remove();
                
                // Reload cart and orders
                this.loadCart();
                this.loadOrders();
                
                // Update main app counts
                if (window.app) {
                    window.app.updateCartCount();
                }
            } else {
                const error = await response.json();
                this.showAlert(error.error || 'Checkout failed', 'error');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            this.showAlert('Checkout failed', 'error');
        }
    }


    async updateCartCount() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/cart', {
                headers: {
                    'Authorization': sessionToken
                }
            });

            if (response.ok) {
                const cartData = await response.json();
                
                // Update ALL cart count elements
                document.querySelectorAll('.cart-count, .cart-count-badge').forEach(el => {
                    el.textContent = cartData.item_count || '0';
                });
                
                console.log(`🛒 Cart count updated to: ${cartData.item_count}`);
            }
        } catch (error) {
            console.error('Update cart count error:', error);
        }
    }

    async removeFromWishlist(productId) {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch(`/api/wishlist/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': sessionToken
                }
            });

            if (response.ok) {
                // Update the sidebar counter immediately using the response data
                // Most APIs return the updated wishlist or count after deletion
                const result = await response.json();
                
                // Option 1: If API returns updated count
                if (result.updated_count !== undefined) {
                    this.updateSidebarWishlistCount(result.updated_count);
                } 
                // Option 2: If API returns updated wishlist
                else if (result.wishlist_items) {
                    this.updateSidebarWishlistCount(result.wishlist_items.length);
                }
                // Option 3: Fallback - make one API call to get updated data
                else {
                    const updatedResponse = await fetch('/api/wishlist', {
                        headers: { 'Authorization': sessionToken }
                    });
                    if (updatedResponse.ok) {
                        const wishlistItems = await updatedResponse.json();
                        this.updateSidebarWishlistCount(wishlistItems.length);
                        // Also update the wishlist grid without another API call
                        this.renderWishlistGrid(wishlistItems);
                    }
                }

                    this.showAlert('Product removed from wishlist', 'success');

                } else {
                    const error = await response.json();
                    this.showAlert(error.error || 'Error removing from wishlist', 'error');
                }
            } catch (error) {
                console.error('Remove from wishlist error:', error);
                this.showAlert('Error removing from wishlist', 'error');
            }
        }

        // Add this method to render the wishlist grid without making API calls
        renderWishlistGrid(wishlistItems) {
            const wishlistGrid = document.getElementById('wishlist-grid');
            const clearBtn = document.getElementById('clear-wishlist-btn');
            
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
                                    <i class="fas fa-shopping-cart"></i> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
                if (clearBtn) clearBtn.style.display = 'block';
            }
        }

    async clearWishlist() {
        if (!confirm('Are you sure you want to clear your entire wishlist?')) {
            return;
        }

        try {
            const sessionToken = localStorage.getItem('sessionToken');
            console.log('🗑️ Clearing entire wishlist...');
            
            const response = await fetch('/api/wishlist/clear', {
                method: 'POST',
                headers: {
                    'Authorization': sessionToken
                }
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Wishlist cleared:', result);
                
                this.showAlert(`Wishlist cleared! Removed ${result.deleted_count} items.`, 'success');
                this.loadWishlist(); // Reload to show empty state
                
                // Update main app wishlist count
                if (window.app) {
                    window.app.updateWishlistCount();
                }
            } else {
                const error = await response.json();
                console.error('❌ Clear wishlist failed:', error);
                this.showAlert(error.error || 'Failed to clear wishlist', 'error');
            }
        } catch (error) {
            console.error('Clear wishlist error:', error);
            this.showAlert('Error clearing wishlist', 'error');
        }
    }

    async updateWishlistCount() {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/wishlist', {
                headers: {
                    'Authorization': sessionToken
                }
            });

            if (response.ok) {
                const wishlistItems = await response.json();
                
                // Update ALL wishlist count elements
                document.querySelectorAll('.wishlist-count, .wishlist-count-badge').forEach(el => {
                    el.textContent = wishlistItems.length || '0';
                });
                
                console.log(`❤️ Wishlist count updated to: ${wishlistItems.length}`);
            }
        } catch (error) {
            console.error('Update wishlist count error:', error);
        }
    }

    async moveToCart(productId) {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
        
            // First add to cart
            const cartResponse = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionToken
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: 1
                })
            });

            if (cartResponse.ok) {

                // Update cart count immediately
                await this.updateCartCount();
                
                // Then remove from wishlist
                await this.removeFromWishlist(productId);
                this.showAlert('Product moved to cart', 'success');

                // Reload both cart and wishlist to reflect changes
                //this.loadCart();
                //this.loadWishlist();

            } else {
                const error = await cartResponse.json();
                this.showAlert(error.error || 'Error moving to cart', 'error');
            }
        } catch (error) {
            console.error('Move to cart error:', error);
            this.showAlert('Error moving product to cart', 'error');
        }
    }

    async removeFromCart(productId) {
        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch(`/api/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': sessionToken
                }
            });

            if (response.ok) {
                this.showAlert('Product removed from cart', 'success');
                this.loadCart(); // Reload to show updated cart
                
                // Update main app cart count
                if (window.app) {
                    window.app.updateCartCount();
                }
            } else {
                const error = await response.json();
                this.showAlert(error.error || 'Error removing from cart', 'error');
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
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch(`/api/cart/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionToken
                },
                body: JSON.stringify({
                    quantity: newQuantity
                })
            });

            if (response.ok) {
                this.showAlert('Quantity updated', 'success');
                this.loadCart(); // Reload to show updated quantities
                
                // Update main app cart count
                if (window.app) {
                    window.app.updateCartCount();
                }
            } else {
                const error = await response.json();
                this.showAlert(error.error || 'Error updating quantity', 'error');
            }
        } catch (error) {
            console.error('Update cart quantity error:', error);
            this.showAlert('Error updating quantity', 'error');
        }
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
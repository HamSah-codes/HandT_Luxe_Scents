// Admin Dashboard JavaScript
class AdminManager {
    constructor() {
        this.products = [];
        this.categories = [];
        this.messages = [];
        this.reviews = [];
        this.stats = {};
        this.currentSection = 'dashboard';
        this.init();
    }

    async init() {
        await this.checkAuth();
        this.setupNavigation();
        this.setupEventListeners();
        this.loadDashboardStats();
    }

    async checkAuth() {
        try {
            const response = await fetch('/api/admin/check-auth');
            const data = await response.json();
            
            if (!data.authenticated) {
                document.getElementById('admin-login').style.display = 'block';
                document.getElementById('admin-dashboard').style.display = 'none';
            } else {
                document.getElementById('admin-login').style.display = 'none';
                document.getElementById('admin-dashboard').style.display = 'block';
                this.loadInitialData();
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        }
    }

    async login(username, password) {
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                location.reload();
            } else {
                this.showAlert('Invalid credentials', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('Login failed', 'error');
        }
    }

    async logout() {
        try {
            console.log('Logging out...');
            const response = await fetch('/api/admin/logout', {
                method: 'POST', // Ensure it's POST, not GET
                credentials: 'include'
            });
            
            console.log('Logout response status:', response.status);
            
            // Instead of reloading, redirect to the same page to clear any cached state
            window.location.href = window.location.href + '?logout=' + Date.now();
            
        } catch (error) {
            console.error('Logout error:', error);
            // Still redirect even if there's an error
            window.location.href = window.location.href;
        }
    }
    // Navigation Methods
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const section = item.dataset.section;
                this.showSection(section);
            });
        });

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                this.logout();
            };
        }

        // Show default section
        this.showSection('dashboard');
    }

    showSection(section) {
        // Hide all sections
        document.querySelectorAll('.admin-section').forEach(sec => {
            sec.classList.remove('active');
        });

        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Activate corresponding nav item
        const activeNavItem = document.querySelector(`[data-section="${section}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }

        // Load section data
        this.loadSectionData(section);
    }

    async loadSectionData(section) {
        switch (section) {
            case 'products':
                await this.loadProducts();
                break;
            case 'categories':
                await this.loadCategories();
                break;
            case 'messages':
                await this.loadMessages();
                break;
            case 'orders':
                await this.loadOrders();
                break;
            case 'reviews':
                await this.loadReviews();
                break;
            case 'wishlists':
                await this.loadWishlists();
                break;
        }
    }

    // Data Loading Methods
    async loadInitialData() {
        await Promise.all([
            this.loadProducts(),
            this.loadCategories(),
            this.loadMessages(),
            this.loadReviews()
        ]);
    }

    async loadDashboardStats() {
        try {
            const response = await fetch('/api/admin/stats');
            if (response.ok) {
                this.stats = await response.json();
                this.renderStats();
            } else {
                console.error('Failed to load stats, status:', response.status);
                // Set default values if API fails
                this.setDefaultStats();
            }
        } catch (error) {
            console.error('Error loading stats:', error);
            this.setDefaultStats();
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('/api/products');
            if (response.ok) {
                this.products = await response.json();
                this.renderProducts();
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.showAlert('Error loading products', 'error');
        }
    }

    async loadCategories() {
        try {
            const response = await fetch('/api/categories');
            if (response.ok) {
                this.categories = await response.json();
                this.renderCategories();
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            this.showAlert('Error loading categories', 'error');
        }
    }

    async loadOrders() {
        try {
            const response = await fetch('/api/admin/orders', {
                credentials: 'include' 
            });

            if (response.ok) {
                this.orders = await response.json();
                this.renderOrders();
            } else {
                console.error('Failed to load orders');
                this.showAlert('Error loading orders', 'error');
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            this.showAlert('Error loading orders', 'error');
        }
    }

    renderOrders() {
        const tbody = document.getElementById('orders-table');
        if (!tbody) return;

        if (!this.orders || this.orders.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="no-data">No orders found</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.orders.map(order => this.getOrderRowHTML(order)).join('');
    }

    getOrderRowHTML(order) {
        // Get customer display name with fallbacks
        const customerDisplay = order.user_name || 
                            order.user_email || 
                            order.customer_name || 
                            order.email ||
                            `User ${order.user_id}`;
    

        return `
            <tr>
                <td>${order.id}</td>
                <td>${order.order_number}</td>
                <td>${customerDisplay}</td>
                <td>${order.items.length} items</td>
                <td>GH₵${order.total_amount}</td>
                <td class="status-${order.status}">${order.status}</td>
                <td>${new Date(order.created_at).toLocaleDateString()}</td>
                <td class="actions">
                    <button class="edit-btn" onclick="adminManager.viewOrder(${order.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="edit-btn" onclick="adminManager.updateOrderStatus(${order.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    async viewOrder(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            const itemsHTML = order.items.map(item => {
                // Handle different possible property names
                const itemName = item.name || item.product_name || 'Unknown Item';
                const itemPrice = item.price || item.unit_price || 0;
                const itemQuantity = item.quantity || 1;
                
                return `${itemName} - GH₵${itemPrice} x ${itemQuantity}`;
            }).join('');
            
            alert(`Order #${order.order_number}\n\nItems:\n${itemsHTML}\n\nTotal: GH₵${order.total_amount}\nStatus: ${order.status}`);
        }
    }

    async viewOrderDetails(orderId) {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                credentials: 'include'
            });
            
            if (response.ok) {
                const orderData = await response.json();
                this.showOrderDetailsModal(orderData);
            } else {
                this.showAlert('Failed to load order details', 'error');
            }
        } catch (error) {
            console.error('Error loading order details:', error);
            this.showAlert('Error loading order details', 'error');
        }
    }


    async updateOrderStatus(orderId) {
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        const currentOrder = this.orders.find(o => o.id === orderId);
        const currentStatus = currentOrder ? currentOrder.status : 'pending';
        
        // Create modal with dropdown
        const modalHTML = `
            <div class="modal-overlay" id="status-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Update Order Status</h3>
                        <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Order #:</strong> ${currentOrder.order_number}</p>
                        <p><strong>Current Status:</strong> <span class="status-${currentStatus}">${currentStatus}</span></p>
                        
                        <label for="status-select"><strong>New Status:</strong></label>
                        <select id="status-select" class="status-select">
                            ${validStatuses.map(status => 
                                `<option value="${status}" ${status === currentStatus ? 'selected' : ''}>${status}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-cancel" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
                        <button class="btn btn-primary" id="confirm-status-update">Update Status</button>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        document.querySelectorAll('#status-modal').forEach(modal => modal.remove());
        
        // Add new modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Add event listener for the update button
        document.getElementById('confirm-status-update').addEventListener('click', async () => {
            const selectElement = document.getElementById('status-select');
            const newStatus = selectElement.value;
            
            try {
                const response = await fetch(`/api/admin/orders/${orderId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ status: newStatus })
                });

                if (response.ok) {
                    this.showAlert('Order status updated successfully!', 'success');
                    document.querySelector('#status-modal').remove();
                    await this.loadOrders();
                } else {
                    this.showAlert('Failed to update order status', 'error');
                }
            } catch (error) {
                console.error('Update order status error:', error);
                this.showAlert('Error updating order status', 'error');
            }
        });
    }
        

    

    async loadMessages() {
        try {
            const response = await fetch('/api/admin/messages');
            if (response.ok) {
                this.messages = await response.json();
                this.renderMessages();
            }
        } catch (error) {
            console.error('Error loading messages:', error);
            this.showAlert('Error loading messages', 'error');
        }
    }

    async loadReviews() {
        try {
            const response = await fetch('/api/reviews');
            if (response.ok) {
                this.reviews = await response.json();
                this.renderReviews();
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            this.showAlert('Error loading reviews', 'error');
        }
    }

    async loadWishlists() {
        // This would typically fetch wishlist data from an admin endpoint
        // For now, we'll show a placeholder
        this.showAlert('Wishlist data loading feature coming soon!', 'info');
    }

    // Render Methods
    renderStats() {
        const stats = this.stats;
        
        if (stats.total_products !== undefined) {
            document.getElementById('total-products').textContent = stats.total_products;
        } else {
            document.getElementById('total-products').textContent = '0';
        }

        if (stats.total_messages !== undefined) {
            document.getElementById('total-messages').textContent = stats.total_messages;
        } else {
            document.getElementById('total-messages').textContent = '0';
        }

        if (stats.total_reviews !== undefined) {
            document.getElementById('total-reviews').textContent = stats.total_reviews;
        } else {
            document.getElementById('total-reviews').textContent = '0';
        }

        if (stats.total_users !== undefined) {
            document.getElementById('total-users').textContent = stats.total_users;
        } else {
            document.getElementById('total-users').textContent = '0';
        }

        if (stats.total_orders !== undefined) {
            document.getElementById('total-orders').textContent = stats.total_orders;
        } else {
            document.getElementById('total-orders').textContent = '0';
        }
    }

    renderProducts() {
        const tbody = document.getElementById('products-table');
        if (!tbody) return;

        tbody.innerHTML = this.products.map(product => this.getProductRowHTML(product)).join('');
    }

    getProductRowHTML(product) {
        return `
            <tr>
                <td>${product.id}</td>
                <td>
                    <img src="${product.image_url || '/static/assets/img/placeholder.jpg'}" 
                         alt="${product.name}" 
                         class="product-thumbnail"
                         onerror="this.src='/static/assets/img/placeholder.jpg'">
                </td>
                <td>${product.name}</td>
                <td>${product.brand}</td>
                <td>GH₵${product.price}</td>
                <td>${product.category_name || 'Uncategorized'}</td>
                <td class="actions">
                    <button class="edit-btn" onclick="adminManager.editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="adminManager.deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    renderCategories() {
        const tbody = document.getElementById('categories-table');
        if (!tbody) return;

        tbody.innerHTML = this.categories.map(category => this.getCategoryRowHTML(category)).join('');
    }

    getCategoryRowHTML(category) {
        return `
            <tr>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>${category.description || 'No description'}</td>
                <td class="actions">
                    <button class="edit-btn" onclick="adminManager.editCategory(${category.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="adminManager.deleteCategory(${category.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    renderMessages() {
        const tbody = document.getElementById('messages-table');
        if (!tbody) return;

        tbody.innerHTML = this.messages.map(message => this.getMessageRowHTML(message)).join('');
    }

    getMessageRowHTML(message) {
        return `
            <tr>
                <td>${message.id}</td>
                <td>${message.name}</td>
                <td>${message.email}</td>
                <td>${message.message.substring(0, 50)}${message.message.length > 50 ? '...' : ''}</td>
                <td>${new Date(message.created_at).toLocaleDateString()}</td>
                <td class="actions">
                    <button class="edit-btn" onclick="adminManager.viewMessage(${message.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="delete-btn" onclick="adminManager.deleteMessage(${message.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    renderReviews() {
        const tbody = document.getElementById('reviews-table');
        if (!tbody) return;

        tbody.innerHTML = this.reviews.map(review => this.getReviewRowHTML(review)).join('');
    }

    getReviewRowHTML(review) {
        const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
        
        return `
            <tr>
                <td>${review.id}</td>
                <td>${review.product_name || 'Product ' + review.product_id}</td>
                <td>${review.user_name || 'User ' + review.user_id}</td>
                <td>${stars}</td>
                <td>${review.comment.substring(0, 30)}${review.comment.length > 30 ? '...' : ''}</td>
                <td>${new Date(review.created_at).toLocaleDateString()}</td>
                <td class="actions">
                    <button class="edit-btn ${review.is_approved ? 'active' : ''}" 
                            onclick="adminManager.toggleReviewApproval(${review.id})">
                        <i class="fas ${review.is_approved ? 'fa-check' : 'fa-times'}"></i>
                    </button>
                    <button class="delete-btn" onclick="adminManager.deleteReview(${review.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    // Form Management Methods
    setupEventListeners() {
        // Product form
        this.setupProductForm();
        
        // Category form
        this.setupCategoryForm();
        
        // Login form
        this.setupLoginForm();
    }

    setupProductForm() {
        const addBtn = document.getElementById('add-product-btn');
        const cancelBtn = document.getElementById('cancel-product');
        const form = document.getElementById('product-form');
        const formModal = document.getElementById('add-product-form');

        if (addBtn && formModal) {
            addBtn.addEventListener('click', () => {
                formModal.style.display = 'block';
                this.populateCategoryDropdown();
            });
        }

        if (cancelBtn && formModal) {
            cancelBtn.addEventListener('click', () => {
                formModal.style.display = 'none';
                form.reset();
            });
        }

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.addProduct();
            });
        }
    }

    setupCategoryForm() {
        const addBtn = document.getElementById('add-category-btn');
        const cancelBtn = document.getElementById('cancel-category');
        const form = document.getElementById('category-form');
        const formModal = document.getElementById('add-category-form');

        if (addBtn && formModal) {
            addBtn.addEventListener('click', () => {
                formModal.style.display = 'block';
            });
        }

        if (cancelBtn && formModal) {
            cancelBtn.addEventListener('click', () => {
                formModal.style.display = 'none';
                form.reset();
            });
        }

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.addCategory();
            });
        }
    }

    setupLoginForm() {
        const form = document.getElementById('login-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const username = document.getElementById('username').value;
                const password = document.getElementById('password').value;
                await this.login(username, password);
            });
        }
    }

    // Data Management Methods
    async addProduct() {
        const form = document.getElementById('product-form');
        const formData = new FormData(form);
        
        // Validate required fields
        const requiredFields = ['name', 'brand', 'price', 'category_id', 'stock_quantity'];
        for (let field of requiredFields) {
            if (!formData.get(field)) {
                this.showAlert(`Please fill in the ${field.replace('_', ' ')} field`, 'error');
                return;
            }
        }

        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                body: formData  // Send as FormData for file upload
            });

            if (response.ok) {
                this.showAlert('Product added successfully!', 'success');
                document.getElementById('add-product-form').style.display = 'none';
                form.reset();
                await this.loadProducts();
                await this.loadDashboardStats();
            } else {
                const data = await response.json();
                this.showAlert(data.error, 'error');
            }
        } catch (error) {
            console.error('Add product error:', error);
            this.showAlert('Error adding product', 'error');
        }
    }

    async addCategory() {
        const form = document.getElementById('category-form');
        const formData = new FormData(form);
        
        const categoryData = {
            name: formData.get('name'),
            description: formData.get('description'),
            image_url: formData.get('image_url')
        };

        try {
            const response = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoryData)
            });

            if (response.ok) {
                this.showAlert('Category added successfully!', 'success');
                document.getElementById('add-category-form').style.display = 'none';
                form.reset();
                await this.loadCategories();
                await this.loadDashboardStats();
            } else {
                const data = await response.json();
                this.showAlert(data.error, 'error');
            }
        } catch (error) {
            console.error('Add category error:', error);
            this.showAlert('Error adding category', 'error');
        }
    }

    // Edit Methods (Placeholder - would need additional endpoints)
    editProduct(productId) {
        this.showAlert('Edit product feature coming soon!', 'info');
    }

    editCategory(categoryId) {
        this.showAlert('Edit category feature coming soon!', 'info');
    }

    // Delete Methods (Placeholder - would need additional endpoints)
    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.showAlert('Delete product feature coming soon!', 'info');
        }
    }

    deleteCategory(categoryId) {
        if (confirm('Are you sure you want to delete this category?')) {
            this.showAlert('Delete category feature coming soon!', 'info');
        }
    }

    deleteMessage(messageId) {
        if (confirm('Are you sure you want to delete this message?')) {
            this.showAlert('Delete message feature coming soon!', 'info');
        }
    }

    deleteReview(reviewId) {
        if (confirm('Are you sure you want to delete this review?')) {
            this.showAlert('Delete review feature coming soon!', 'info');
        }
    }

    // View Methods
    viewMessage(messageId) {
        const message = this.messages.find(m => m.id === messageId);
        if (message) {
            alert(`Message from ${message.name} (${message.email}):\n\n${message.message}`);
        }
    }

    toggleReviewApproval(reviewId) {
        this.showAlert('Review approval feature coming soon!', 'info');
    }

    // Utility Methods
    populateCategoryDropdown() {
        const categorySelect = document.getElementById('product-category');
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">Select Category</option>' +
                this.categories.map(cat => 
                    `<option value="${cat.id}">${cat.name}</option>`
                ).join('');
        }
    }

    showAlert(message, type = 'info') {
        // Remove existing alerts
        document.querySelectorAll('.admin-alert').forEach(alert => alert.remove());

        const alert = document.createElement('div');
        alert.className = `admin-alert admin-alert-${type}`;
        alert.textContent = message;

        const adminMain = document.querySelector('.admin-main');
        if (adminMain) {
            adminMain.insertBefore(alert, adminMain.firstChild);
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }
}

// Initialize admin manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminManager = new AdminManager();
});
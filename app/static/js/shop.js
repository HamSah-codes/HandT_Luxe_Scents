// Shop Page JavaScript
class ShopManager {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.filters = {
            category: 'all',
            scent_type: 'all',
            gender: 'all',
            min_price: 0,
            max_price: 1000,
            search: ''
        };
        this.currentSort = 'featured';
        this.init();
    }

    async init() {
        await this.loadCategories();
        await this.loadProducts();
        this.setupEventListeners();
        this.setupFilters();
        this.renderProducts();
    }

    // Data Loading Methods
    async loadProducts() {
        try {
            const queryParams = new URLSearchParams(this.filters).toString();
            const response = await fetch(`/api/products?${queryParams}`);
            this.products = await response.json();
            this.filteredProducts = [...this.products];
            this.sortProducts();
            this.updateResultsCount();
        } catch (error) {
            console.error('Error loading products:', error);
            this.showAlert('Error loading products', 'error');
        }
    }

    async loadCategories() {
        try {
            const response = await fetch('/api/categories');
            const categories = await response.json();
            this.renderCategoryFilters(categories);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    // Filter Methods
    setupFilters() {
        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.applyFilters();
            });
        }

        // Gender filter
        const genderFilters = document.querySelectorAll('[data-filter="gender"]');
        genderFilters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                genderFilters.forEach(f => f.classList.remove('active'));
                e.target.classList.add('active');
                this.filters.gender = e.target.dataset.value;
                this.applyFilters();
            });
        });

        // Scent type filter
        const scentFilter = document.getElementById('scent-filter');
        if (scentFilter) {
            scentFilter.addEventListener('change', (e) => {
                this.filters.scent_type = e.target.value;
                this.applyFilters();
            });
        }

        // Price range filter
        const priceRange = document.getElementById('price-range');
        const priceMax = document.getElementById('price-max');
        if (priceRange && priceMax) {
            priceRange.addEventListener('input', (e) => {
                this.filters.max_price = e.target.value;
                priceMax.textContent = `GH₵${e.target.value}`;
                this.applyFilters();
            });
        }

        // Search functionality
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filters.search = e.target.value.trim();
                    this.applyFilters();
                }, 500);
            });
        }

        // Sort functionality
        const sortSelect = document.getElementById('sort-by');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortProducts();
                this.renderProducts();
            });
        }

        // Clear filters
        const clearFiltersBtn = document.querySelector('.clear-filters-btn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.filters.category !== 'all' && product.category_name !== this.filters.category) {
                return false;
            }

            // Gender filter
            if (this.filters.gender !== 'all' && product.gender !== this.filters.gender) {
                return false;
            }

            // Scent type filter
            if (this.filters.scent_type !== 'all' && product.scent_type !== this.filters.scent_type) {
                return false;
            }

            // Price filter
            if (product.price < this.filters.min_price || product.price > this.filters.max_price) {
                return false;
            }

            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search.toLowerCase();
                const searchableText = `${product.name} ${product.brand} ${product.description}`.toLowerCase();
                if (!searchableText.includes(searchTerm)) {
                    return false;
                }
            }

            return true;
        });

        this.sortProducts();
        this.renderProducts();
        this.updateResultsCount();
    }

    clearFilters() {
        // Reset filter values
        this.filters = {
            category: 'all',
            scent_type: 'all',
            gender: 'all',
            min_price: 0,
            max_price: 1000,
            search: ''
        };

        // Reset UI elements
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) categoryFilter.value = 'all';

        const genderFilters = document.querySelectorAll('[data-filter="gender"]');
        genderFilters.forEach(filter => filter.classList.remove('active'));
        if (genderFilters[0]) genderFilters[0].classList.add('active');

        const scentFilter = document.getElementById('scent-filter');
        if (scentFilter) scentFilter.value = 'all';

        const priceRange = document.getElementById('price-range');
        const priceMax = document.getElementById('price-max');
        if (priceRange && priceMax) {
            priceRange.value = 1000;
            priceMax.textContent = 'GH₵1000';
        }

        const searchInput = document.querySelector('.search-input');
        if (searchInput) searchInput.value = '';

        // Reapply filters
        this.applyFilters();
        this.showAlert('Filters cleared', 'success');
    }

    // Sort Methods
    sortProducts() {
        switch (this.currentSort) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                this.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'featured':
            default:
                // Default sorting - you might want to implement featured logic
                this.filteredProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
        }
    }

    // Render Methods
    renderProducts() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        if (this.filteredProducts.length === 0) {
            grid.innerHTML = this.getNoResultsHTML();
            return;
        }

        grid.innerHTML = this.filteredProducts.map(product => this.getProductHTML(product)).join('');

        // Add event listeners to product buttons
        this.attachProductEventListeners();
    }

    getProductHTML(product) {
        return `
            <div class="product-card" data-product-id="${product.id}">
                ${product.stock_quantity === 0 ? '<div class="product-badge">Out of Stock</div>' : ''}
                <div class="product-image">
                    <img src="${product.image_url || '/static/assets/img/placeholder.jpg'}" 
                         alt="${product.name}" 
                         onerror="this.src='/static/assets/img/placeholder.jpg'">
                    <div class="product-actions">
                        <button class="wishlist-btn ${this.isInWishlist(product.id) ? 'active' : ''}" 
                                onclick="shopManager.toggleWishlist(${product.id})"
                                title="${this.isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}">
                            <i class="${this.isInWishlist(product.id) ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        <button class="quick-view-btn" onclick="shopManager.quickView(${product.id})" title="Quick View">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-brand">${product.brand}</p>
                    <p class="product-price">GH₵${product.price}</p>
                    <div class="product-meta">
                        ${product.scent_type ? `<span class="scent-type">${product.scent_type}</span>` : ''}
                        ${product.gender ? `<span class="gender">${product.gender}</span>` : ''}
                    </div>
                    <button class="add-to-cart-btn" 
                            onclick="shopManager.addToCart(${product.id})"
                            ${product.stock_quantity === 0 ? 'disabled' : ''}>
                        ${product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        `;
    }

    getNoResultsHTML() {
        return `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No fragrances found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button class="btn btn-primary" onclick="shopManager.clearFilters()">Clear All Filters</button>
            </div>
        `;
    }

    renderCategoryFilters(categories) {
        const categoryFilter = document.getElementById('category-filter');
        const scentFilter = document.getElementById('scent-filter');

        if (categoryFilter) {
            categoryFilter.innerHTML = `
                <option value="all">All Categories</option>
                ${categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
            `;
        }

        if (scentFilter) {
            // You might want to get scent types from your products or define them
            const scentTypes = ['Woody', 'Floral', 'Citrus', 'Oriental', 'Fresh', 'Spicy'];
            scentFilter.innerHTML = `
                <option value="all">All Scents</option>
                ${scentTypes.map(scent => `<option value="${scent}">${scent}</option>`).join('')}
            `;
        }
    }

    attachProductEventListeners() {
        // Additional event listeners can be added here if needed
    }

    // Product Interaction Methods
    async addToCart(productId, quantity = 1) {
        if (!window.app.currentUser) {
            window.app.showModal('login-modal');
            return false;
        }

        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionToken
                },
                body: JSON.stringify({ product_id: productId, quantity })
            });

            if (response.ok) {
                this.updateCartButton(productId, true);
                window.app.updateCartCount();
                this.showAlert('Product added to cart!', 'success');
                
                // Update user dashboard if open
                if (window.userDashboard) {
                    window.userDashboard.loadCart();
                }
                return true;
            } else {
                this.showAlert('Failed to add product to cart', 'error');
                return false;
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            this.showAlert('Error adding to cart', 'error');
            return false;
        }
    }

    async toggleWishlist(productId) {
        if (!window.app.currentUser) {
            window.app.showModal('login-modal');
            return;
        }

        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const isInWishlist = this.isInWishlist(productId);

            const response = await fetch(`/api/wishlist${isInWishlist ? `/${productId}` : ''}`, {
                method: isInWishlist ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionToken
                },
                body: isInWishlist ? undefined : JSON.stringify({ product_id: productId })
            });

            if (response.ok) {
                if (isInWishlist) {
                    this.removeFromWishlist(productId);
                    this.showAlert('Removed from wishlist', 'success');
                } else {
                    this.addToWishlist(productId);
                    this.showAlert('Added to wishlist!', 'success');
                }
                this.updateWishlistButton(productId, !isInWishlist);
                window.app.updateWishlistCount();
                
                // Update user dashboard if open
                if (window.userDashboard) {
                    window.userDashboard.loadWishlist();
                }
            }
        } catch (error) {
            console.error('Wishlist toggle error:', error);
            this.showAlert('Error updating wishlist', 'error');
        }
    }

    async quickView(productId) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            const product = await response.json();

            if (response.ok) {
                this.showQuickViewModal(product);
            }
        } catch (error) {
            console.error('Quick view error:', error);
            this.showAlert('Error loading product details', 'error');
        }
    }

    // Wishlist Management
    isInWishlist(productId) {
        // This would typically check against a stored wishlist array
        // For now, we'll check the button state
        const wishlistBtn = document.querySelector(`.wishlist-btn[onclick="shopManager.toggleWishlist(${productId})"]`);
        return wishlistBtn ? wishlistBtn.classList.contains('active') : false;
    }

    addToWishlist(productId) {
        const wishlistBtn = document.querySelector(`.wishlist-btn[onclick="shopManager.toggleWishlist(${productId})"]`);
        if (wishlistBtn) {
            wishlistBtn.classList.add('active');
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
            wishlistBtn.title = 'Remove from Wishlist';
        }
    }

    removeFromWishlist(productId) {
        const wishlistBtn = document.querySelector(`.wishlist-btn[onclick="shopManager.toggleWishlist(${productId})"]`);
        if (wishlistBtn) {
            wishlistBtn.classList.remove('active');
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
            wishlistBtn.title = 'Add to Wishlist';
        }
    }

    // UI Update Methods
    updateResultsCount() {
        const resultsCount = document.getElementById('products-count');
        if (resultsCount) {
            resultsCount.textContent = this.filteredProducts.length;
        }
    }

    updateCartButton(productId, added = false) {
        const button = document.querySelector(`.add-to-cart-btn[onclick="shopManager.addToCart(${productId})"]`);
        if (button && added) {
            const originalText = button.textContent;
            button.textContent = 'Added!';
            button.style.background = 'var(--success)';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }
    }

    updateWishlistButton(productId, isInWishlist) {
        const button = document.querySelector(`.wishlist-btn[onclick="shopManager.toggleWishlist(${productId})"]`);
        if (button) {
            if (isInWishlist) {
                button.classList.add('active');
                button.innerHTML = '<i class="fas fa-heart"></i>';
                button.title = 'Remove from Wishlist';
            } else {
                button.classList.remove('active');
                button.innerHTML = '<i class="far fa-heart"></i>';
                button.title = 'Add to Wishlist';
            }
        }
    }

    // Modal Methods
    showQuickViewModal(product) {
        const modalHTML = `
            <div id="quick-view-modal" class="modal">
                <div class="modal-content quick-view-modal">
                    <div class="quick-view-content">
                        <div class="quick-view-image">
                            <img src="${product.image_url || '/static/assets/img/placeholder.jpg'}" 
                                 alt="${product.name}"
                                 onerror="this.src='/static/assets/img/placeholder.jpg'">
                        </div>
                        <div class="quick-view-details">
                            <button class="close-modal">&times;</button>
                            <h2>${product.name}</h2>
                            <p class="quick-view-brand">${product.brand}</p>
                            <p class="quick-view-price">GH₵${product.price}</p>
                            <p class="quick-view-description">${product.description || 'No description available.'}</p>
                            
                            <div class="quick-view-meta">
                                ${product.category_name ? `
                                    <div class="meta-item">
                                        <span class="meta-label">Category</span>
                                        <span class="meta-value">${product.category_name}</span>
                                    </div>
                                ` : ''}
                                ${product.scent_type ? `
                                    <div class="meta-item">
                                        <span class="meta-label">Scent Type</span>
                                        <span class="meta-value">${product.scent_type}</span>
                                    </div>
                                ` : ''}
                                ${product.gender ? `
                                    <div class="meta-item">
                                        <span class="meta-label">Gender</span>
                                        <span class="meta-value">${product.gender}</span>
                                    </div>
                                ` : ''}
                                ${product.mood ? `
                                    <div class="meta-item">
                                        <span class="meta-label">Mood</span>
                                        <span class="meta-value">${product.mood}</span>
                                    </div>
                                ` : ''}
                            </div>

                            <div class="quantity-selector">
                                <span>Quantity:</span>
                                <button class="quantity-btn" onclick="shopManager.updateQuantity(-1)">-</button>
                                <span class="quantity-display" id="quick-view-quantity">1</span>
                                <button class="quantity-btn" onclick="shopManager.updateQuantity(1)">+</button>
                            </div>

                            <div class="quick-view-actions">
                                <button class="add-to-cart-btn" style="flex: 2;" 
                                        onclick="shopManager.addToCartFromQuickView(${product.id})">
                                    Add to Cart
                                </button>
                                <button class="wishlist-btn ${this.isInWishlist(product.id) ? 'active' : ''}" 
                                        style="flex: 1;"
                                        onclick="shopManager.toggleWishlist(${product.id})">
                                    <i class="${this.isInWishlist(product.id) ? 'fas' : 'far'} fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal
        const existingModal = document.getElementById('quick-view-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add new modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = document.getElementById('quick-view-modal');
        modal.style.display = 'block';

        // Add event listeners
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    updateQuantity(change) {
        const quantityDisplay = document.getElementById('quick-view-quantity');
        if (quantityDisplay) {
            let quantity = parseInt(quantityDisplay.textContent) + change;
            quantity = Math.max(1, quantity); // Minimum quantity is 1
            quantityDisplay.textContent = quantity;
        }
    }

    async addToCartFromQuickView(productId) {
        const quantityDisplay = document.getElementById('quick-view-quantity');
        const quantity = quantityDisplay ? parseInt(quantityDisplay.textContent) : 1;
        
        if (!window.app.currentUser) {
            window.app.showModal('login-modal');
            return;
        }

        try {
            const sessionToken = localStorage.getItem('sessionToken');
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionToken
                },
                body: JSON.stringify({ product_id: productId, quantity })
            });

            if (response.ok) {
                window.app.updateCartCount();
                this.showAlert('Product added to cart!', 'success');
                
                // Close quick view modal
                const modal = document.getElementById('quick-view-modal');
                if (modal) {
                    modal.remove();
                }
            } else {
                this.showAlert('Failed to add product to cart', 'error');
            }
        } catch (error) {
            console.error('Add to cart error:', error);
            this.showAlert('Error adding to cart', 'error');
        }
    }

    // Search Methods
    searchProducts(searchTerm) {
        this.filters.search = searchTerm;
        this.applyFilters();
    }

    // Utility Methods
    showAlert(message, type = 'info') {
        window.app.showAlert(message, type);
    }

    setupEventListeners() {
        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('quick-view-modal');
                if (modal) {
                    modal.remove();
                }
            }
        });
    }
}

// Initialize shop manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.shopManager = new ShopManager();
});
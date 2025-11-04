// Shop Page JavaScript
class ShopPage {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentFilters = {
            gender: 'all',
            scent: '',
            brand: '',
            mood: '',
            season: '',
            maxPrice: 1000
        };
        this.currentSort = 'featured';
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupEventListeners();
        this.displayProducts();
        this.updateResultsCount();
    }

    // Load products data
    async loadProducts() {
        // Extended product data with Ghana Cedis pricing
        this.products = [
            {
                id: 1,
                name: "Midnight Oud",
                brand: "H&T Luxe",
                price: 450.00,
                originalPrice: 600.00,
                image: "https://images.unsplash.com/photo-1590736969953-7ce4d1c63f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "men",
                scent: "woody",
                brandType: "ht-luxe",
                mood: "confident",
                season: "winter",
                description: "A rich and intense fragrance with oud wood notes",
                isNew: true,
                isBestSeller: true
            },
            {
                id: 2,
                name: "Velvet Rose",
                brand: "H&T Luxe",
                price: 400.00,
                originalPrice: 500.00,
                image: "https://images.unsplash.com/photo-1590737400275-54a5c7f4ecc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "women",
                scent: "floral",
                brandType: "ht-luxe",
                mood: "romantic",
                season: "spring",
                description: "Elegant floral scent with rose and jasmine notes",
                isNew: true,
                isBestSeller: false
            },
            {
                id: 3,
                name: "Ocean Breeze",
                brand: "H&T Luxe",
                price: 350.00,
                originalPrice: 450.00,
                image: "https://images.unsplash.com/photo-1544468266-6a8948001c78?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "unisex",
                scent: "citrus",
                brandType: "ht-luxe",
                mood: "energetic",
                season: "summer",
                description: "Fresh and invigorating citrus aquatic fragrance",
                isNew: false,
                isBestSeller: true
            },
            {
                id: 4,
                name: "Sandalwood Essence",
                brand: "H&T Luxe",
                price: 475.00,
                originalPrice: 600.00,
                image: "https://images.unsplash.com/photo-1615634260167-6a76c217f7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "men",
                scent: "woody",
                brandType: "ht-luxe",
                mood: "calm",
                season: "autumn",
                description: "Warm and comforting sandalwood fragrance",
                isNew: false,
                isBestSeller: false
            },
            {
                id: 5,
                name: "Citrus Bloom",
                brand: "Premium",
                price: 375.00,
                originalPrice: 480.00,
                image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "unisex",
                scent: "citrus",
                brandType: "premium",
                mood: "energetic",
                season: "summer",
                description: "Bright citrus notes with floral undertones",
                isNew: true,
                isBestSeller: false
            },
            {
                id: 6,
                name: "Oriental Nights",
                brand: "Exclusive",
                price: 500.00,
                originalPrice: 650.00,
                image: "https://images.unsplash.com/photo-1546453573-2cffef054b7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "women",
                scent: "oriental",
                brandType: "exclusive",
                mood: "romantic",
                season: "winter",
                description: "Exotic oriental fragrance with spice notes",
                isNew: false,
                isBestSeller: true
            },
            {
                id: 7,
                name: "Fresh Linen",
                brand: "H&T Luxe",
                price: 320.00,
                originalPrice: 400.00,
                image: "https://images.unsplash.com/photo-1544441893-675973e31985?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "unisex",
                scent: "fresh",
                brandType: "ht-luxe",
                mood: "calm",
                season: "spring",
                description: "Clean and crisp fresh linen scent",
                isNew: true,
                isBestSeller: false
            },
            {
                id: 8,
                name: "Spice Route",
                brand: "Premium",
                price: 420.00,
                originalPrice: 550.00,
                image: "https://images.unsplash.com/photo-1590737400275-54a5c7f4ecc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                category: "men",
                scent: "spicy",
                brandType: "premium",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: true
            }
        ];

        this.filteredProducts = [...this.products];
        this.hideLoadingState();
    }

    setupEventListeners() {
        // Gender filter buttons
        document.querySelectorAll('[data-filter]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleGenderFilter(e.target.getAttribute('data-filter'));
            });
        });

        // Scent type filter buttons
        document.querySelectorAll('[data-scent]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleScentFilter(e.target.getAttribute('data-scent'));
            });
        });

        // Brand filter buttons
        document.querySelectorAll('[data-brand]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleBrandFilter(e.target.getAttribute('data-brand'));
            });
        });

        // Mood filter buttons
        document.querySelectorAll('[data-mood]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleMoodFilter(e.target.getAttribute('data-mood'));
            });
        });

        // Season filter buttons
        document.querySelectorAll('[data-season]').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleSeasonFilter(e.target.getAttribute('data-season'));
            });
        });

        // Price range slider
        const priceSlider = document.getElementById('price-range');
        priceSlider.addEventListener('input', (e) => {
            this.handlePriceFilter(parseInt(e.target.value));
        });

        // Sort options
        document.getElementById('sort-by').addEventListener('change', (e) => {
            this.handleSort(e.target.value);
        });

        // Clear filters button
        document.querySelector('.clear-filters-btn').addEventListener('click', () => {
            this.clearAllFilters();
        });

        // Mobile filter links
        document.querySelectorAll('.mobile-menu-link[data-filter]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = e.target.getAttribute('data-filter');
                this.handleGenderFilter(filter);
                this.closeMobileMenu();
            });
        });
    }

    handleGenderFilter(gender) {
        // Update active state for gender buttons
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${gender}"]`).classList.add('active');

        this.currentFilters.gender = gender;
        this.applyFilters();
    }

    handleScentFilter(scent) {
        // Toggle scent filter
        const button = document.querySelector(`[data-scent="${scent}"]`);
        button.classList.toggle('active');
        
        if (button.classList.contains('active')) {
            this.currentFilters.scent = scent;
        } else {
            this.currentFilters.scent = '';
        }
        this.applyFilters();
    }

    handleBrandFilter(brand) {
        // Toggle brand filter
        const button = document.querySelector(`[data-brand="${brand}"]`);
        button.classList.toggle('active');
        
        if (button.classList.contains('active')) {
            this.currentFilters.brand = brand;
        } else {
            this.currentFilters.brand = '';
        }
        this.applyFilters();
    }

    handleMoodFilter(mood) {
        // Toggle mood filter
        const button = document.querySelector(`[data-mood="${mood}"]`);
        button.classList.toggle('active');
        
        if (button.classList.contains('active')) {
            this.currentFilters.mood = mood;
        } else {
            this.currentFilters.mood = '';
        }
        this.applyFilters();
    }

    handleSeasonFilter(season) {
        // Toggle season filter
        const button = document.querySelector(`[data-season="${season}"]`);
        button.classList.toggle('active');
        
        if (button.classList.contains('active')) {
            this.currentFilters.season = season;
        } else {
            this.currentFilters.season = '';
        }
        this.applyFilters();
    }

    handlePriceFilter(maxPrice) {
        this.currentFilters.maxPrice = maxPrice;
        document.getElementById('price-max').textContent = `GH₵ ${maxPrice}`;
        this.applyFilters();
    }

    handleSort(sortType) {
        this.currentSort = sortType;
        this.sortProducts();
        this.displayProducts();
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Gender filter
            if (this.currentFilters.gender !== 'all' && product.category !== this.currentFilters.gender) {
                return false;
            }

            // Scent filter
            if (this.currentFilters.scent && product.scent !== this.currentFilters.scent) {
                return false;
            }

            // Brand filter
            if (this.currentFilters.brand && product.brandType !== this.currentFilters.brand) {
                return false;
            }

            // Mood filter
            if (this.currentFilters.mood && product.mood !== this.currentFilters.mood) {
                return false;
            }

            // Season filter
            if (this.currentFilters.season && product.season !== this.currentFilters.season) {
                return false;
            }

            // Price filter
            if (product.price > this.currentFilters.maxPrice) {
                return false;
            }

            return true;
        });

        this.sortProducts();
        this.displayProducts();
        this.updateResultsCount();
    }

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
                this.filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case 'featured':
            default:
                this.filteredProducts.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
                break;
        }
    }

    displayProducts() {
        const grid = document.getElementById('products-grid');
        
        if (this.filteredProducts.length === 0) {
            this.showNoResults();
            return;
        }

        this.hideNoResults();

        grid.innerHTML = this.filteredProducts.map(product => `
            <div class="product-card" data-category="${product.category}" data-scent="${product.scent}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.isNew ? '<span class="product-badge">New</span>' : ''}
                    ${product.isBestSeller ? '<span class="product-badge" style="background: linear-gradient(135deg, #e74c3c, #c0392b);">Best Seller</span>' : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-brand">${product.brand}</p>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        GH₵ ${product.price.toFixed(2)}
                        ${product.originalPrice > product.price ? 
                            `<span style="text-decoration: line-through; color: var(--silver); font-size: 0.9rem; margin-left: 8px;">
                                GH₵ ${product.originalPrice.toFixed(2)}
                            </span>` : ''
                        }
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="shopPage.addToCart(${product.id})">
                            <i class="fas fa-shopping-bag"></i>
                            Add to Cart
                        </button>
                        <button class="btn btn-secondary" onclick="shopPage.addToWishlist(${product.id})">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateResultsCount() {
        const countElement = document.getElementById('products-count');
        countElement.textContent = this.filteredProducts.length;
    }

    showNoResults() {
        document.getElementById('products-grid').style.display = 'none';
        document.getElementById('no-results').style.display = 'block';
        document.getElementById('loading-state').style.display = 'none';
    }

    hideNoResults() {
        document.getElementById('products-grid').style.display = 'grid';
        document.getElementById('no-results').style.display = 'none';
    }

    hideLoadingState() {
        document.getElementById('loading-state').style.display = 'none';
    }

    clearAllFilters() {
        // Reset all filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Reset gender filter to 'all'
        document.querySelector('[data-filter="all"]').classList.add('active');

        // Reset price slider
        document.getElementById('price-range').value = 1000;
        document.getElementById('price-max').textContent = 'GH₵ 1000';

        // Reset sort to featured
        document.getElementById('sort-by').value = 'featured';

        // Reset current filters
        this.currentFilters = {
            gender: 'all',
            scent: '',
            brand: '',
            mood: '',
            season: '',
            maxPrice: 1000
        };

        this.currentSort = 'featured';
        this.applyFilters();
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            // Get current cart from localStorage
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Check if product already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            // Save back to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count
            this.updateCartCount();
            
            // Show success message
            this.showNotification(`${product.name} added to cart!`, 'success');
        }
    }

    addToWishlist(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            // Get current wishlist from localStorage
            let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
            
            // Check if product already in wishlist
            const existingItem = wishlist.find(item => item.id === productId);
            
            if (!existingItem) {
                wishlist.push(product);
                
                // Save back to localStorage
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                
                // Update wishlist count
                this.updateWishlistCount();
                
                // Show success message
                this.showNotification(`${product.name} added to wishlist!`, 'success');
            } else {
                this.showNotification(`${product.name} is already in your wishlist!`, 'info');
            }
        }
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').textContent = totalItems;
    }

    updateWishlistCount() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        document.getElementById('wishlist-count').textContent = wishlist.length;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    border-left: 4px solid var(--gold);
                    z-index: 10000;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                }
                .notification-success {
                    border-left-color: #27ae60;
                }
                .notification-info {
                    border-left-color: #2980b9;
                }
        }        `;
            document.head.appendChild(styles);
        }
        document.body.appendChild(notification);

        // Trigger slide-in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);   
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
        }, 3000);
        setTimeout(() => {
            notification.remove();
        }, 3300);
    }
    closeMobileMenu() {
        document.getElementById('mobile-menu').classList.remove('open');
    }
}

// Initialize shop page
const shopPage = new ShopPage();
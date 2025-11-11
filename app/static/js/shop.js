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
        this.addScrollIndicators();
    }

        // Add search functionality to ShopPage class
    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        let suggestionsContainer = null;

        if (searchInput && searchBtn) {
            // Create suggestions container
            suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'search-suggestions';
            searchInput.parentNode.appendChild(suggestionsContainer);

            const performSearch = () => {
                const searchTerm = searchInput.value.toLowerCase().trim();
                if (searchTerm) {
                    const searchResults = this.products.filter(product => 
                        product.name.toLowerCase().includes(searchTerm) ||
                        product.brand.toLowerCase().includes(searchTerm) ||
                        product.category.toLowerCase().includes(searchTerm) ||
                        product.scent.toLowerCase().includes(searchTerm) ||
                        product.description.toLowerCase().includes(searchTerm)
                    );

                    this.filteredProducts = searchResults;
                    this.displayProducts();
                    this.updateResultsCount();
                    
                    if (searchResults.length === 0) {
                        this.showNotification('No products found matching your search', 'info');
                    } else {
                        this.showNotification(`Found ${searchResults.length} product(s)`, 'success');
                    }
                    
                    this.hideSuggestions();
                }
            };

            // Real-time search suggestions
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.trim().toLowerCase();
                if (searchTerm.length > 0) {
                    this.showSuggestions(searchTerm);
                } else {
                    this.hideSuggestions();
                }
            });

            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });

            // Hide suggestions when clicking outside
            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && (!suggestionsContainer || !suggestionsContainer.contains(e.target))) {
                    this.hideSuggestions();
                }
            });
        }
    }

    // Show search suggestions in ShopPage
    showSuggestions(searchTerm) {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (!suggestionsContainer) return;

        const suggestions = this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm)
        ).slice(0, 5);

        if (suggestions.length > 0) {
            suggestionsContainer.innerHTML = suggestions.map(product => `
                <div class="suggestion-item" data-product-id="${product.id}">
                    <img src="${product.image}" alt="${product.name}" class="suggestion-image">
                    <div class="suggestion-info">
                        <div class="suggestion-name">${product.name}</div>
                        <div class="suggestion-brand">${product.brand}</div>
                        <div class="suggestion-price">GH₵${product.price}</div>
                    </div>
                </div>
            `).join('');

            suggestionsContainer.style.display = 'block';

            // Add click event to suggestions
            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    const productId = item.getAttribute('data-product-id');
                    const searchInput = document.querySelector('.search-input');
                    const product = this.products.find(p => p.id == productId);
                    
                    if (product) {
                        searchInput.value = product.name;
                        this.hideSuggestions();
                        
                        // Filter products by the selected product name
                        this.filteredProducts = this.products.filter(p => 
                            p.name.toLowerCase().includes(product.name.toLowerCase())
                        );
                        this.displayProducts();
                        this.updateResultsCount();
                        this.showNotification(`Found ${this.filteredProducts.length} product(s) for "${product.name}"`, 'success');
                    }
                });
            });
        } else {
            this.hideSuggestions();
        }
    }

    // Hide search suggestions in ShopPage
    hideSuggestions() {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }

    // Load products data
    async loadProducts() {
        // In a real application, you might fetch this data from a server
        // For this example, we'll use a static array of products
        this.products = [
            {
                id: 1,
                name: "Oud Nior",
                brand: "Khadlaj",
                price: 240.00,
                originalPrice: 300.00,
                image: "/static/assets/img/OUD_NIOR.jpeg",
                category: "unisex",
                scent: "woody",
                brandType: "Khadlaj",
                mood: "confident",
                season: "winter",
                description: "A rich and intense fragrance with oud wood notes",
                isNew: false,
                isBestSeller: true
            },
            {
                id: 2,
                name: "Black Leather",
                brand: "Fragrance World",
                price: 140.00,
                originalPrice: 155.00,
                image: "/static/assets/img/Black_Leather.jpeg",
                category: "men",
                scent: "floral",
                brandType: "Fragrance World",
                mood: "romantic",
                season: "spring",
                description: "Elegant floral scent with rose and jasmine notes",
                isNew: false,
                isBestSeller: true
            },
            {
                id: 3,
                name: "Matelot",
                brand: "Fragrance World",
                price: 150.00,
                originalPrice: 160.00,
                image: "/static/assets/img/Matelot.jpeg",
                category: "men",
                scent: "citrus",
                brandType: "Fragrance World",
                mood: "energetic",
                season: "summer",
                description: "Fresh and invigorating citrus aquatic fragrance",
                isNew: false,
                isBestSeller: true
            },
            {
                id: 4,
                name: "Suave Intense",
                brand: "Fragrance World",
                price: 149.00,
                originalPrice: 155.00,
                image: "/static/assets/img/Suave_Intense.jpeg",
                category: "unisex",
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
                name: "Mr. England Touch",
                brand: "Premium",
                price: 140.00,
                originalPrice: 155.00,
                image: "/static/assets/img/Mr_England.jpeg",
                category: "men",
                scent: "citrus",
                brandType: "premium",
                mood: "energetic",
                season: "summer",
                description: "Bright citrus notes with floral undertones",
                isNew: false,
                isBestSeller: false
            },
            {
                id: 6,
                name: "Instant Love",
                brand: "Montera",
                price: 140.00,
                originalPrice: 155.00,
                image: "/static/assets/img/Instant_Love.jpeg",
                category: "unisex",
                scent: "oriental",
                brandType: "exclusive",
                mood: "romantic",
                season: "winter",
                description: "Exotic oriental fragrance with spice notes",
                isNew: false,
                isBestSeller: false
            },
            {
                id: 7,
                name: "Explore The One",
                brand: "H&T Luxe",
                price: 155.00,
                originalPrice: 170.00,
                image: "/static/assets/img/Explore_The_One.jpeg",
                category: "unisex",
                scent: "fresh",
                brandType: "ht-luxe",
                mood: "calm",
                season: "spring",
                description: "Clean and crisp fresh linen scent",
                isNew: false,
                isBestSeller: false
            },
            {
                id: 8,
                name: "Night Club",
                brand: "Fragrance World",
                price: 185.00,
                originalPrice: 200.00,
                image: "/static/assets/img/Night_Club.jpeg",
                category: "men",
                scent: "spicy",
                brandType: "Fragrance World",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: true
            },
            {
                id: 9,
                name: "Tobacco Rouge",
                brand: "Pendora Scents",
                price: 140.00,
                originalPrice: 155.00,
                image: "/static/assets/img/Tobacco_Rouge.jpeg",
                category: "men",
                scent: "spicy",
                brandType: "premium",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: true,
                isBestSeller: false
            },
            {
                id: 10,
                name: "Ameer Al-Oudh",
                brand: "Lattafa",
                price: 220.00,
                originalPrice: 250.00,
                image: "/static/assets/img/Ameer_Al-Oudh.jpeg",
                category: "men",
                scent: "spicy",
                brandType: "Lattafa",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: true
            },
            {
                id: 11,
                name: "Exchange",
                brand: "Premium",
                price: 140.00,
                originalPrice: 155.00,
                image: "/static/assets/img/Exchange.jpeg",
                category: "unisex",
                scent: "spicy",
                brandType: "premium",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: true
            },
            {
                id: 12,
                name: "Ramz Lattafa(Gold)",
                brand: "Lattafa",
                price: 200.00,
                originalPrice: 250.00,
                image: "/static/assets/img/Ramz_Lattafa(Gold).jpeg",
                category: "unisex",
                scent: "spicy",
                brandType: "Lattafa",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: true
            },
            {
                id: 13,
                name: "Ramz Lattafa(Silver)",
                brand: "Lattafa",
                price: 2000.00,
                originalPrice: 250.00,
                image: "/static/assets/img/Ramz_Lattafa(Silver).jpeg",
                category: "men",
                scent: "spicy",
                brandType: "Lattafa",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: true
            },
            {
                id: 14,
                name: "Barakkat satin oud",
                brand: "Premium",
                price: 140.00,
                originalPrice: 155.00,
                image: "/static/assets/img/Barakkat_Satin_Oud.jpeg",
                category: "men",
                scent: "spicy",
                brandType: "premium",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: false
            },
            {
                id: 15,
                name: "Brown Orchid(Blanc)",
                brand: "Fragrance World",
                price: 140.00,
                originalPrice: 155.00,
                image: "/static/assets/img/Brown_Orchid(Blanc).jpeg",
                category: "men",
                scent: "spicy",
                brandType: "Fragrance World",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: true
            },
            {
                id: 16,
                name: "Lomani Code",
                brand: "Premium",
                price: 140.00,
                originalPrice: 155.00,
                image: "/static/assets/img/Lomani_Code.jpeg",
                category: "men",
                scent: "spicy",
                brandType: "premium",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: true,
                isBestSeller: false
            },
            {
                id: 17,
                name: "Barakkat Rouge 549",
                brand: "Premium",
                price: 140.00,
                originalPrice: 155.00,
                image: "/static/assets/img/Barakkat_Rouge.jpeg",
                category: "unisex",
                scent: "spicy",
                brandType: "premium",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: true
            },
            {
                id: 18,
                name: "After !2",
                brand: "Efolia",
                price: 160.00,
                originalPrice: 180.00,
                image: "/static/assets/img/After_12.jpeg",
                category: "men",
                scent: "spicy",
                brandType: "Efolia",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: false
            },
            {
                id: 19,
                name: "Carbon Black",
                brand: "Fragrace World",
                price: 140.00,
                originalPrice: 155.00,
                image: "/static/assets/img/Carbon_Black.jpeg",
                category: "men",
                scent: "spicy",
                brandType: "Fragrance World",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: true
            },
            {
                id: 20,
                name: "Proud Of You(Amber)",
                brand: "Fragrance World",
                price: 140.00,
                originalPrice: 155.00,
                image: "/static/assets/img/Proud_Of_You.jpeg",
                category: "women",
                scent: "spicy",
                brandType: "Fragrance World",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: false
            },
            {
                id: 21,
                name: "Lail Malaki",
                brand: "Lattafa",
                price: 190.00,
                originalPrice: 220.00,
                image: "/static/assets/img/Lail_Malaki.jpeg",
                category: "women",
                scent: "spicy",
                brandType: "Lattafa",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: false
            },
            {
                id: 22,
                name: "Emperor",
                brand: "Premium",
                price: 160.00,
                originalPrice: 180.00,
                image: "/static/assets/img/Emperor.jpeg",
                category: "men",
                scent: "spicy",
                brandType: "premium",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: false
            },
            {
                id: 23,
                name: "Oniro",
                brand: "Fragrance World",
                price: 140.00,
                originalPrice: 155.00,
                image: "/static/assets/img/Oniro.jpeg",
                category: "men",
                scent: "spicy",
                brandType: "Lattafa",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: true
            },
            {
                id: 24,
                name: "Queen Of Red",
                brand: "Fragrance World",
                price: 140.00,
                originalPrice: 155.00,
                image: "/static/assets/img/Queen_Of_Red.webp",
                category: "women",
                scent: "spicy",
                brandType: "Fragrance World",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: true
            },
            {
                id: 25,
                name: "Ely Sia",
                brand: "Fragrance World",
                price: 140.00,
                originalPrice: 155.00,
                image: "/static/assets/img/Ely_Sia.jpeg",
                category: "women",
                scent: "spicy",
                brandType: "Fragrance World",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: false,
                isBestSeller: false
            },
            {
                id: 26,
                name: "Intensio",
                brand: "L'Affair",
                price: 175.00,
                originalPrice: 210.00,
                image: "/static/assets/img/Intensio.jpeg",
                category: "men",
                scent: "spicy",
                brandType: "L'Affair",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: true,
                isBestSeller: false
            },
            {
                id: 27,
                name: "Hayaati Rose",
                brand: "Fragrance World",
                price: 160.00,
                originalPrice: 180.00,
                image: "/static/assets/img/Hayaati_Rose.jpeg",
                category: "women",
                scent: "spicy",
                brandType: "Fragrance World",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: true,
                isBestSeller: false
            },
            {
                id: 28,
                name: "Malaki Secret",
                brand: "Sahari",
                price: 160.00,
                originalPrice: 180.00,
                image: "/static/assets/img/Malaki_Secret.jpeg",
                category: "women",
                scent: "spicy",
                brandType: "Sahari",
                mood: "confident",
                season: "autumn",
                description: "Warm spicy notes with exotic undertones",
                isNew: true,
                isBestSeller: false
            }
        ];

        this.filteredProducts = [...this.products];
        this.hideLoadingState();
    }

        // Add scroll indicators to filters sidebar
    addScrollIndicators() {
        const sidebar = document.querySelector('.filters-sidebar');
        
        sidebar.addEventListener('scroll', () => {
            const scrollTop = sidebar.scrollTop;
            const scrollHeight = sidebar.scrollHeight;
            const clientHeight = sidebar.clientHeight;
            
            // Top scroll indicator
            if (scrollTop > 10) {
                sidebar.classList.add('scrolled');
            } else {
                sidebar.classList.remove('scrolled');
            }
            
            // Bottom scroll indicator
            if (scrollTop + clientHeight < scrollHeight - 10) {
                sidebar.classList.add('scrolled-bottom');
            } else {
                sidebar.classList.remove('scrolled-bottom');
            }
        });
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
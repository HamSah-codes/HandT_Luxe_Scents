// global-search.js - Search functionality for all pages
class GlobalSearch {
    constructor() {
        this.products = [];
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupSearch();
    }

    // Load products (same as in shop.js)
    async loadProducts() {
        // Use the same product data as shop.js
        this.products = [
            // ... (copy the same products array from shop.js)
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
                price: 200.00,
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
            // ... (include all other products from shop.js)
        ];
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');
        let suggestionsContainer = null;

        if (searchInput && searchBtn) {
            // Create suggestions container
            suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'search-suggestions';
            searchInput.parentNode.appendChild(suggestionsContainer);

            // Real-time search suggestions
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.trim().toLowerCase();
                if (searchTerm.length > 0) {
                    this.showSuggestions(searchTerm);
                } else {
                    this.hideSuggestions();
                }
            });

            searchBtn.addEventListener('click', () => this.performSearch(searchInput.value));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
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

    performSearch(searchTerm) {
        if (searchTerm.trim()) {
            // For non-shop pages, redirect to shop page with search term
            localStorage.setItem('searchTerm', searchTerm.trim());
            window.location.href = 'shop.html';
        }
    }

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
                    this.selectProductForShop(productId);
                });
            });
        } else {
            this.hideSuggestions();
        }
    }

   selectProductForShop(productId) {
        // Store the product ID in localStorage to filter on shop page
        localStorage.setItem('selectedProductId', productId);
        
        // Redirect to shop page
        window.location.href = 'shop.html';
    }

    hideSuggestions() {
        const suggestionsContainer = document.querySelector('.search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }
}

// Initialize global search on all pages
const globalSearch = new GlobalSearch();
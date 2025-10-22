// User Interface JavaScript

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

// User data (in a real app, this would come from backend)
let userCart = [];
let userWishlist = [];
let userReviews = [];

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
    alert('Product added to cart!');
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
        alert('Product added to wishlist!');
    } else {
        userWishlist = userWishlist.filter(id => id !== productId);
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        alert('Product removed from wishlist!');
    }
    
    displayWishlist();
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
    alert('Product moved to cart!');
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
            alert('Review submitted!');
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
            alert('Message sent! We will get back to you soon.');
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
                alert('Your cart is empty!');
                return;
            }
            
            alert('Proceeding to checkout! In a real application, this would redirect to a payment page.');
            // In a real app, this would redirect to checkout/payment page
        });
    }
}

// Initialize User Interface
document.addEventListener('DOMContentLoaded', function() {
    displayAllProducts();
    displayWishlist();
    displayCart();
    displayUserReviews();
    setupFilters();
    setupReviewForm();
    setupDirectMessageForm();
    setupCheckout();
});
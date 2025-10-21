// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Featured Products Data (In a real app, this would come from the backend)
const featuredProducts = [
    {
        id: 1,
        name: "Midnight Oud",
        brand: "H&T Luxe",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1590736969953-7ce4d1c63f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "men",
        scent: "woody",
        mood: "confident",
        season: "winter"
    },
    {
        id: 2,
        name: "Velvet Rose",
        brand: "H&T Luxe",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1590737400275-54a5c7f4ecc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "women",
        scent: "floral",
        mood: "romantic",
        season: "spring"
    },
    {
        id: 3,
        name: "Ocean Breeze",
        brand: "H&T Luxe",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1544468266-6a8948001c78?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "unisex",
        scent: "citrus",
        mood: "energetic",
        season: "summer"
    },
    {
        id: 4,
        name: "Sandalwood Essence",
        brand: "H&T Luxe",
        price: 94.99,
        image: "https://images.unsplash.com/photo-1615634260167-6a76c217f7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        category: "men",
        scent: "woody",
        mood: "calm",
        season: "autumn"
    }
];

// Display Featured Products
function displayFeaturedProducts() {
    const productsGrid = document.getElementById('featured-products');
    
    if (productsGrid) {
        featuredProducts.forEach(product => {
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
        
        // Add event listeners for buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', addToCart);
        });
        
        document.querySelectorAll('.add-to-wishlist').forEach(button => {
            button.addEventListener('click', addToWishlist);
        });
    }
}

// Add to Cart Functionality
function addToCart(e) {
    const productId = e.target.getAttribute('data-id');
    const product = featuredProducts.find(p => p.id == productId);
    
    // In a real app, this would send a request to the backend
    alert(`Added ${product.name} to cart!`);
    
    // Update cart count in UI (if implemented)
    updateCartCount();
}

// Add to Wishlist Functionality
function addToWishlist(e) {
    const productId = e.target.closest('.add-to-wishlist').getAttribute('data-id');
    const product = featuredProducts.find(p => p.id == productId);
    const heartIcon = e.target.closest('.add-to-wishlist').querySelector('i');
    
    // Toggle heart icon
    if (heartIcon.classList.contains('far')) {
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        alert(`Added ${product.name} to wishlist!`);
    } else {
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        alert(`Removed ${product.name} from wishlist!`);
    }
    
    // In a real app, this would send a request to the backend
}

// Update Cart Count (placeholder function)
function updateCartCount() {
    // This would update the cart count in the navigation
    console.log('Cart updated');
}

// Contact Form Submission
const messageForm = document.getElementById('message-form');
if (messageForm) {
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // In a real app, this would send the data to the backend
        alert(`Thank you for your message, ${name}! We'll get back to you soon.`);
        
        // Reset form
        this.reset();
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayFeaturedProducts();
});
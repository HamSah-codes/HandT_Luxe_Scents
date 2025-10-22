// Admin Interface JavaScript

// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'H&T_Luxe_Scents',
    password: 'HamSahLati'
};

// Sample data (in a real app, this would come from backend)
let adminProducts = [
    {
        id: 1,
        name: "Midnight Oud",
        brand: "H&T Luxe",
        price: 89.99,
        category: "men",
        description: "A rich and intense fragrance with oud wood notes",
        image: "https://images.unsplash.com/photo-1590736969953-7ce4d1c63f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Velvet Rose",
        brand: "H&T Luxe",
        price: 79.99,
        category: "women",
        description: "Elegant floral scent with rose and jasmine notes",
        image: "https://images.unsplash.com/photo-1590737400275-54a5c7f4ecc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
];

let categories = [
    { id: 1, name: "Men", description: "Fragrances for men" },
    { id: 2, name: "Women", description: "Fragrances for women" },
    { id: 3, name: "Unisex", description: "Unisex fragrances" }
];

let messages = [
    { 
        id: 1, 
        name: "John Doe", 
        email: "john@example.com", 
        message: "I love your products! When will you have new arrivals?", 
        date: "2023-10-15" 
    },
    { 
        id: 2, 
        name: "Jane Smith", 
        email: "jane@example.com", 
        message: "Do you ship internationally?", 
        date: "2023-10-14" 
    }
];

let reviews = [
    { 
        id: 1, 
        product: "Midnight Oud", 
        user: "Mike Johnson", 
        rating: 5, 
        review: "Amazing fragrance! Lasts all day.", 
        date: "2023-10-13" 
    }
];

let wishlists = [
    { user: "Sarah Wilson", product: "Velvet Rose", addedDate: "2023-10-12" }
];

let discounts = [
    { code: "WELCOME10", percentage: 10, startDate: "2023-10-01", endDate: "2023-12-31", status: "Active" }
];

// Login functionality
function setupLogin() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                // Successful login
                document.getElementById('admin-login').style.display = 'none';
                document.getElementById('admin-dashboard').style.display = 'block';
                
                // Initialize dashboard
                initializeDashboard();
            } else {
                alert('Invalid credentials! Please try again.');
            }
        });
    }
}

// Logout functionality
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            document.getElementById('admin-dashboard').style.display = 'none';
            document.getElementById('admin-login').style.display = 'flex';
            
            // Clear form fields
            document.getElementById('login-form').reset();
        });
    }
}

// Navigation functionality
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get target section
            const targetSection = this.getAttribute('data-section');
            
            // Hide all sections
            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

// Initialize Dashboard
function initializeDashboard() {
    updateStats();
    displayProducts();
    displayCategories();
    displayMessages();
    displayReviews();
    displayWishlists();
    displayDiscounts();
    setupProductForm();
    setupCategoryForm();
    setupDiscountForm();
}

// Update Dashboard Stats
function updateStats() {
    document.getElementById('total-products').textContent = adminProducts.length;
    document.getElementById('total-messages').textContent = messages.length;
    document.getElementById('total-reviews').textContent = reviews.length;
    document.getElementById('active-users').textContent = '25'; // Example static data
}

// Display Products
function displayProducts() {
    const productsTable = document.getElementById('products-table');
    
    if (productsTable) {
        productsTable.innerHTML = '';
        
        adminProducts.forEach(product => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}" class="table-image"></td>
                <td>${product.name}</td>
                <td>${product.brand}</td>
                <td>$${product.price}</td>
                <td>${product.category}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${product.id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${product.id}">Delete</button>
                </td>
            `;
            
            productsTable.appendChild(row);
        });
        
        // Add event listeners for product actions
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editProduct);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteProduct);
        });
    }
}

// Display Categories
function displayCategories() {
    const categoriesTable = document.getElementById('categories-table');
    
    if (categoriesTable) {
        categoriesTable.innerHTML = '';
        
        categories.forEach(category => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>${category.description}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${category.id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${category.id}">Delete</button>
                </td>
            `;
            
            categoriesTable.appendChild(row);
        });
    }
}

// Display Messages
function displayMessages() {
    const messagesTable = document.getElementById('messages-table');
    
    if (messagesTable) {
        messagesTable.innerHTML = '';
        
        messages.forEach(message => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${message.id}</td>
                <td>${message.name}</td>
                <td>${message.email}</td>
                <td>${message.message.substring(0, 50)}...</td>
                <td>${message.date}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${message.id}">View</button>
                    <button class="action-btn delete-btn" data-id="${message.id}">Delete</button>
                </td>
            `;
            
            messagesTable.appendChild(row);
        });
    }
}

// Display Reviews
function displayReviews() {
    const reviewsTable = document.getElementById('reviews-table');
    
    if (reviewsTable) {
        reviewsTable.innerHTML = '';
        
        reviews.forEach(review => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${review.id}</td>
                <td>${review.product}</td>
                <td>${review.user}</td>
                <td>${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</td>
                <td>${review.review.substring(0, 30)}...</td>
                <td>${review.date}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${review.id}">View</button>
                    <button class="action-btn delete-btn" data-id="${review.id}">Delete</button>
                </td>
            `;
            
            reviewsTable.appendChild(row);
        });
    }
}

// Display Wishlists
function displayWishlists() {
    const wishlistsTable = document.getElementById('wishlists-table');
    
    if (wishlistsTable) {
        wishlistsTable.innerHTML = '';
        
        wishlists.forEach(item => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${item.user}</td>
                <td>${item.product}</td>
                <td>${item.addedDate}</td>
            `;
            
            wishlistsTable.appendChild(row);
        });
    }
}

// Display Discounts
function displayDiscounts() {
    const discountsTable = document.getElementById('discounts-table');
    
    if (discountsTable) {
        discountsTable.innerHTML = '';
        
        discounts.forEach(discount => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${discount.code}</td>
                <td>${discount.percentage}%</td>
                <td>${discount.startDate}</td>
                <td>${discount.endDate}</td>
                <td><span class="status-badge ${discount.status.toLowerCase()}">${discount.status}</span></td>
                <td>
                    <button class="action-btn edit-btn" data-id="${discount.code}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${discount.code}">Delete</button>
                </td>
            `;
            
            discountsTable.appendChild(row);
        });
    }
}

// Product Form Management
function setupProductForm() {
    const addProductBtn = document.getElementById('add-product-btn');
    const cancelProductBtn = document.getElementById('cancel-product');
    const productForm = document.getElementById('product-form');
    
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            document.getElementById('add-product-form').style.display = 'block';
        });
    }
    
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', function() {
            document.getElementById('add-product-form').style.display = 'none';
            productForm.reset();
        });
    }
    
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newProduct = {
                id: adminProducts.length + 1,
                name: document.getElementById('product-name').value,
                brand: document.getElementById('product-brand').value,
                price: parseFloat(document.getElementById('product-price').value),
                category: document.getElementById('product-category').value,
                description: document.getElementById('product-description').value,
                image: document.getElementById('product-image').value
            };
            
            adminProducts.push(newProduct);
            displayProducts();
            updateStats();
            
            document.getElementById('add-product-form').style.display = 'none';
            this.reset();
            
            alert('Product added successfully!');
        });
    }
    
    // Populate category dropdown
    const categorySelect = document.getElementById('product-category');
    if (categorySelect) {
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name.toLowerCase();
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }
}

// Category Form Management
function setupCategoryForm() {
    const addCategoryBtn = document.getElementById('add-category-btn');
    const cancelCategoryBtn = document.getElementById('cancel-category');
    const categoryForm = document.getElementById('category-form');
    
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', function() {
            document.getElementById('add-category-form').style.display = 'block';
        });
    }
    
    if (cancelCategoryBtn) {
        cancelCategoryBtn.addEventListener('click', function() {
            document.getElementById('add-category-form').style.display = 'none';
            categoryForm.reset();
        });
    }
    
    if (categoryForm) {
        categoryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newCategory = {
                id: categories.length + 1,
                name: document.getElementById('category-name').value,
                description: document.getElementById('category-description').value
            };
            
            categories.push(newCategory);
            displayCategories();
            
            document.getElementById('add-category-form').style.display = 'none';
            this.reset();
            
            alert('Category added successfully!');
        });
    }
}

// Discount Form Management
function setupDiscountForm() {
    const addDiscountBtn = document.getElementById('add-discount-btn');
    const cancelDiscountBtn = document.getElementById('cancel-discount');
    const discountForm = document.getElementById('discount-form');
    
    if (addDiscountBtn) {
        addDiscountBtn.addEventListener('click', function() {
            document.getElementById('add-discount-form').style.display = 'block';
        });
    }
    
    if (cancelDiscountBtn) {
        cancelDiscountBtn.addEventListener('click', function() {
            document.getElementById('add-discount-form').style.display = 'none';
            discountForm.reset();
        });
    }
    
    if (discountForm) {
        discountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newDiscount = {
                code: document.getElementById('discount-code').value,
                percentage: parseInt(document.getElementById('discount-percentage').value),
                startDate: document.getElementById('discount-start').value,
                endDate: document.getElementById('discount-end').value,
                status: "Active"
            };
            
            discounts.push(newDiscount);
            displayDiscounts();
            
            document.getElementById('add-discount-form').style.display = 'none';
            this.reset();
            
            alert('Discount added successfully!');
        });
    }
}

// Product Actions
function editProduct(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = adminProducts.find(p => p.id === productId);
    
    if (product) {
        // In a real app, this would open an edit form with pre-filled data
        alert(`Editing product: ${product.name}`);
    }
}

function deleteProduct(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    
    if (confirm('Are you sure you want to delete this product?')) {
        adminProducts = adminProducts.filter(p => p.id !== productId);
        displayProducts();
        updateStats();
        alert('Product deleted successfully!');
    }
}

// Initialize Admin Interface
document.addEventListener('DOMContentLoaded', function() {
    setupLogin();
    setupLogout();
    setupNavigation();
});
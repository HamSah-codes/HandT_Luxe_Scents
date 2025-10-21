-- Create database schema for H&T Luxe Scents

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    scent TEXT,
    brand_type TEXT,
    mood TEXT,
    season TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id)
);

-- Users table (simplified for this example)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES products (id),
    UNIQUE(user_id, product_id)
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);

-- Discounts table
CREATE TABLE IF NOT EXISTS discounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    percentage INTEGER NOT NULL CHECK (percentage >= 1 AND percentage <= 100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT OR IGNORE INTO categories (name, description) VALUES 
('Men', 'Fragrances for men'),
('Women', 'Fragrances for women'),
('Unisex', 'Unisex fragrances');

INSERT OR IGNORE INTO products (name, brand, price, category, description, image_url, scent, brand_type, mood, season) VALUES 
('Midnight Oud', 'H&T Luxe', 89.99, 'men', 'A rich and intense fragrance with oud wood notes', 'https://images.unsplash.com/photo-1590736969953-7ce4d1c63f55?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'woody', 'ht-luxe', 'confident', 'winter'),
('Velvet Rose', 'H&T Luxe', 79.99, 'women', 'Elegant floral scent with rose and jasmine notes', 'https://images.unsplash.com/photo-1590737400275-54a5c7f4ecc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'floral', 'ht-luxe', 'romantic', 'spring'),
('Ocean Breeze', 'H&T Luxe', 69.99, 'unisex', 'Fresh and invigorating citrus aquatic fragrance', 'https://images.unsplash.com/photo-1544468266-6a8948001c78?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'citrus', 'ht-luxe', 'energetic', 'summer'),
('Sandalwood Essence', 'H&T Luxe', 94.99, 'men', 'Warm and comforting sandalwood fragrance', 'https://images.unsplash.com/photo-1615634260167-6a76c217f7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', 'woody', 'ht-luxe', 'calm', 'autumn');

INSERT OR IGNORE INTO messages (name, email, message) VALUES 
('John Doe', 'john@example.com', 'I love your products! When will you have new arrivals?'),
('Jane Smith', 'jane@example.com', 'Do you ship internationally?');

INSERT OR IGNORE INTO reviews (product_id, user_name, rating, comment) VALUES 
(1, 'Mike Johnson', 5, 'Amazing fragrance! Lasts all day.'),
(2, 'Sarah Wilson', 4, 'Beautiful scent, perfect for evenings.');

INSERT OR IGNORE INTO discounts (code, percentage, start_date, end_date) VALUES 
('WELCOME10', 10, '2023-10-01', '2023-12-31'),
('SUMMER25', 25, '2023-06-01', '2023-08-31');
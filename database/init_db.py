#!/usr/bin/env python3
"""
Database initialization script for H&T Luxe Scents
Run this script to set up the database with initial data
"""

import sqlite3
import os
from datetime import datetime

def get_db_path():
    """Get the absolute path to the database file"""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_path = os.path.join(base_dir, 'database', 'ht_luxe_scents.db')
    
    # Create database directory if it doesn't exist
    db_dir = os.path.dirname(db_path)
    os.makedirs(db_dir, exist_ok=True)
    
    return db_path

def init_database():
    """Initialize the database with all tables and sample data"""
    db_path = get_db_path()
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("Initializing H&T Luxe Scents database...")
    
    # Create tables (same as in app.py)
    tables_sql = [
        # Users table
        '''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP,
            is_active BOOLEAN DEFAULT 1,
            email_verified BOOLEAN DEFAULT 0
        )''',
        
        # Categories table
        '''CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT,
            image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )''',
        
        # Products table
        '''CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            brand TEXT NOT NULL,
            price REAL NOT NULL,
            category_id INTEGER,
            description TEXT,
            image_url TEXT,
            scent_type TEXT,
            gender TEXT,
            mood TEXT,
            season TEXT,
            stock_quantity INTEGER DEFAULT 0,
            is_available BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (category_id) REFERENCES categories (id)
        )''',
        
        # User sessions table
        '''CREATE TABLE IF NOT EXISTS user_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            session_token TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL,
            last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )''',
        
        # Cart table
        '''CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER DEFAULT 1,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
            UNIQUE(user_id, product_id)
        )''',
        
        # Wishlist table
        '''CREATE TABLE IF NOT EXISTS wishlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
            UNIQUE(user_id, product_id)
        )''',
        
        # Orders table
        '''CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            order_number TEXT UNIQUE NOT NULL,
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            shipping_address TEXT,
            billing_address TEXT,
            customer_notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )''',
        
        # Order items table
        '''CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products (id)
        )''',
        
        # Reviews table
        '''CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            comment TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_approved BOOLEAN DEFAULT 0,
            FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )''',
        
        # Messages table
        '''CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_read BOOLEAN DEFAULT 0
        )'''
    ]
    
    for sql in tables_sql:
        cursor.execute(sql)
    
    # Insert sample categories
    sample_categories = [
        ("Men's Fragrances", "Sophisticated scents for the modern gentleman", "/static/assets/img/men-category.jpg"),
        ("Women's Fragrances", "Elegant and captivating fragrances for women", "/static/assets/img/women-category.jpg"),
        ("Unisex Fragrances", "Versatile scents that transcend gender", "/static/assets/img/unisex-category.jpg"),
        ("Luxury Collection", "Exclusive premium fragrances", "/static/assets/img/luxury-category.jpg"),
        ("Seasonal Scents", "Fragrances for every season", "/static/assets/img/seasonal-category.jpg")
    ]
    
    for category in sample_categories:
        cursor.execute(
            'INSERT OR IGNORE INTO categories (name, description, image_url) VALUES (?, ?, ?)',
            category
        )
    
    # Insert sample products
    sample_products = [
        ("Noir Essence", "Luxury Scents", 299.99, 1, 
         "A bold and sophisticated fragrance with notes of leather and spice", 
         "/static/assets/img/product1.jpg", "Woody", "Men", "Confident", "Winter", 50),
        
        ("Rose Elegance", "Fleur Fragrances", 249.99, 2,
         "A delicate floral scent with rose and jasmine notes",
         "/static/assets/img/product2.jpg", "Floral", "Women", "Romantic", "Spring", 35),
        
        ("Citrus Bloom", "Fresh Scents", 199.99, 3,
         "A refreshing unisex fragrance with citrus and green notes",
         "/static/assets/img/product3.jpg", "Citrus", "Unisex", "Energetic", "Summer", 60),
        
        ("Royal Oud", "Luxury Scents", 399.99, 4,
         "An exclusive oud-based fragrance with amber and spice",
         "/static/assets/img/product4.jpg", "Oriental", "Men", "Sophisticated", "Autumn", 20),
        
        ("Ocean Breeze", "Aqua Fragrances", 179.99, 5,
         "A fresh aquatic scent perfect for summer",
         "/static/assets/img/product5.jpg", "Fresh", "Unisex", "Calm", "Summer", 45)
    ]
    
    for product in sample_products:
        cursor.execute('''
            INSERT OR IGNORE INTO products 
            (name, brand, price, category_id, description, image_url, scent_type, gender, mood, season, stock_quantity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', product)
    
    # Create indexes for better performance
    indexes_sql = [
        'CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token)',
        'CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at)',
        'CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)',
        'CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)',
        'CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available)'
    ]
    
    for sql in indexes_sql:
        cursor.execute(sql)
    
    conn.commit()
    conn.close()
    
    print("Database initialized successfully!")
    print(f"Database location: {db_path}")
    print("\nSample data added:")
    print("- 5 categories")
    print("- 5 sample products")
    print("- Performance indexes")

if __name__ == '__main__':
    init_database()
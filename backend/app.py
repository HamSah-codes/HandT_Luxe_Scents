from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'ht_luxe_scents_secret_key_2023'
CORS(app)

# Database initialization
def init_db():
    # Get the directory where this file (app.py) is located
    base_dir = os.path.dirname(os.path.abspath(__file__))
    # Build the path to the database folder
    db_folder = os.path.join(base_dir, '../database')
    # Create the folder if it doesn’t exist
    os.makedirs(db_folder, exist_ok=True)
    # Full path to the database file
    db_path = os.path.join(db_folder, 'ht_luxe_scents.db')

    # Now connect safely
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Example table creation (you can adjust this)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL
        )
    ''')

    conn.commit()
    conn.close()

# Database connection helper
def get_db_connection():
    conn = sqlite3.connect('../database/ht_luxe_scents.db')
    conn.row_factory = sqlite3.Row
    return conn

# Routes for frontend
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/index.html')
def index_html():
    return render_template('index.html')

@app.route('/user-interface.html')
def user_interface():
    return render_template('user-interface.html')

@app.route('/admin-interface')
def admin_interface():
    return render_template('admin-interface.html')

# API Routes for Products
@app.route('/api/products')
def get_products():
    conn = get_db_connection()
    products = conn.execute('SELECT * FROM products').fetchall()
    conn.close()
    
    products_list = []
    for product in products:
        products_list.append(dict(product))
    
    return jsonify(products_list)

@app.route('/api/products/<int:product_id>')
def get_product(product_id):
    conn = get_db_connection()
    product = conn.execute('SELECT * FROM products WHERE id = ?', (product_id,)).fetchone()
    conn.close()
    
    if product is None:
        return jsonify({'error': 'Product not found'}), 404
    
    return jsonify(dict(product))

@app.route('/api/products', methods=['POST'])
def create_product():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.get_json()
    
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO products (name, brand, price, category, description, image_url, scent, brand_type, mood, season) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        (data['name'], data['brand'], data['price'], data['category'], data['description'], 
         data['image_url'], data.get('scent'), data.get('brand_type'), data.get('mood'), data.get('season'))
    )
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Product created successfully'})

# API Routes for Categories
@app.route('/api/categories')
def get_categories():
    conn = get_db_connection()
    categories = conn.execute('SELECT * FROM categories').fetchall()
    conn.close()
    
    categories_list = []
    for category in categories:
        categories_list.append(dict(category))
    
    return jsonify(categories_list)

@app.route('/api/categories', methods=['POST'])
def create_category():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.get_json()
    
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO categories (name, description) VALUES (?, ?)',
        (data['name'], data['description'])
    )
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Category created successfully'})

# API Routes for Messages
@app.route('/api/messages')
def get_messages():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    conn = get_db_connection()
    messages = conn.execute('SELECT * FROM messages ORDER BY created_at DESC').fetchall()
    conn.close()
    
    messages_list = []
    for message in messages:
        messages_list.append(dict(message))
    
    return jsonify(messages_list)

@app.route('/api/messages', methods=['POST'])
def create_message():
    data = request.get_json()
    
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
        (data['name'], data['email'], data['message'])
    )
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Message submitted successfully'})

# API Routes for Reviews
@app.route('/api/reviews')
def get_reviews():
    conn = get_db_connection()
    reviews = conn.execute('''
        SELECT reviews.*, products.name as product_name 
        FROM reviews 
        JOIN products ON reviews.product_id = products.id 
        ORDER BY reviews.created_at DESC
    ''').fetchall()
    conn.close()
    
    reviews_list = []
    for review in reviews:
        reviews_list.append(dict(review))
    
    return jsonify(reviews_list)

@app.route('/api/reviews', methods=['POST'])
def create_review():
    data = request.get_json()
    
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)',
        (data['product_id'], data['user_name'], data['rating'], data['comment'])
    )
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Review submitted successfully'})

# API Routes for Cart
@app.route('/api/cart', methods=['GET', 'POST'])
def manage_cart():
    if request.method == 'POST':
        data = request.get_json()
        # In a real app, you would store cart in session or database
        # This is a simplified version
        return jsonify({'message': 'Product added to cart'})
    
    # GET request - return cart items
    return jsonify([])  # Simplified

# API Routes for Wishlist
@app.route('/api/wishlist', methods=['GET', 'POST', 'DELETE'])
def manage_wishlist():
    if request.method == 'POST':
        data = request.get_json()
        # Add to wishlist logic
        return jsonify({'message': 'Product added to wishlist'})
    
    elif request.method == 'DELETE':
        product_id = request.args.get('product_id')
        # Remove from wishlist logic
        return jsonify({'message': 'Product removed from wishlist'})
    
    # GET request - return wishlist items
    return jsonify([])  # Simplified

# Admin Authentication
@app.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if username == 'H&T_Luxe_Scents' and password == 'HamSahLati':
        session['admin_logged_in'] = True
        return jsonify({'message': 'Login successful'})
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/admin/logout')
def admin_logout():
    session.pop('admin_logged_in', None)
    return jsonify({'message': 'Logout successful'})

@app.route('/admin/check-auth')
def check_admin_auth():
    if session.get('admin_logged_in'):
        return jsonify({'authenticated': True})
    else:
        return jsonify({'authenticated': False})

# Dashboard Stats
@app.route('/admin/stats')
def get_dashboard_stats():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    conn = get_db_connection()
    
    total_products = conn.execute('SELECT COUNT(*) as count FROM products').fetchone()['count']
    total_messages = conn.execute('SELECT COUNT(*) as count FROM messages').fetchone()['count']
    total_reviews = conn.execute('SELECT COUNT(*) as count FROM reviews').fetchone()['count']
    # For active users, you might have a different logic
    active_users = 25  # Example static data
    
    conn.close()
    
    return jsonify({
        'total_products': total_products,
        'total_messages': total_messages,
        'total_reviews': total_reviews,
        'active_users': active_users
    })

if __name__ == '__main__':
    # Initialize database if it doesn't exist
    if not os.path.exists('../database/ht_luxe_scents.db'):
        init_db()
    
    app.run(debug=True, port=5000)
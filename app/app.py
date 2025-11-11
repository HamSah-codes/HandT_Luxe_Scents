from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime, timedelta
import hashlib
import secrets
import bcrypt
import re
from functools import wraps
from dotenv import load_dotenv
load_dotenv() 


def hash_password(password):
    """Hash a password using bcrypt (secure)."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(stored_hash, provided_password):
    """Verify a stored password against one provided by user"""
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_hash.encode('utf-8'))

def create_session(user_id):
    """Create a new session for the user"""
    session_token = secrets.token_urlsafe(64)
    expires_at = datetime.now() + timedelta(days=30)  # 30-day session
    
    conn = None
    try: 
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
            (user_id, session_token, expires_at)
        )
        conn.commit()
        return session_token
    
    except Exception as e:
        print(f"Session creation error: {e}")
        raise e
    finally:
        if conn:
            conn.close()

def get_user_from_session(session_token):
    """Get user from session token"""
    if not session_token:
        return None
    
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT u.* FROM users u 
            JOIN user_sessions s ON u.id = s.user_id 
            WHERE s.session_token = ? AND s.expires_at > datetime('now') AND u.is_active = 1
        ''', (session_token,))
        
        return cursor.fetchone()
       
    
    except Exception as e:
        print(f"Session validation error: {e}")
        return None
    finally:
        if conn:
            conn.close()

def login_required(f):
    """Decorator to require login for protected routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        session_token = request.headers.get('Authorization')
        if not session_token or not get_user_from_session(session_token):
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    if not any(char.isdigit() for char in password):
        return False, "Password must contain at least one digit"
    if not any(char.isupper() for char in password):
        return False, "Password must contain at least one uppercase letter"
    if not any(char.islower() for char in password):
        return False, "Password must contain at least one lowercase letter"
    return True, "Password is strong"



app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'fallback-secret-key-change-in-production')
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = True  # Enable in production with HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
CORS(app)

# Database initialization
def get_db_path():
    """Get the absolute path to the database file"""
    base_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(base_dir)  # Go up one level
    db_path = os.path.join(parent_dir, 'database', 'ht_luxe_scents.db')

    
    # Create database directory if it doesn't exist
    db_dir = os.path.dirname(db_path)
    os.makedirs(db_dir, exist_ok=True)


    return db_path

# Database connection helper
def get_db_connection():
    """Get database connection with proper error handling"""
    try:
        db_path = get_db_path()
        conn = sqlite3.connect(db_path, timeout=20)  # Increase timeout
        conn.row_factory = sqlite3.Row
        # Enable WAL mode for better concurrency
        conn.execute('PRAGMA journal_mode=WAL')
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        raise e

def init_db():
    db_path = get_db_path()
    db_dir = os.path.dirname(db_path)
    
    # Create database directory if it doesn't exist
    os.makedirs(db_dir, exist_ok=True)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Users table (single definition)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP,
            is_active BOOLEAN DEFAULT 1,
            email_verified BOOLEAN DEFAULT 0
        )
    ''')


    # Categories table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')
    
    # Sessions table for persistent login
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            session_token TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL,
            last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    ''')

    # Products table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            brand TEXT,
            price REAL NOT NULL,
            category TEXT,
            description TEXT,
            image_url TEXT,
            scent TEXT,
            brand_type TEXT,
            mood TEXT,
            season TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_available BOOLEAN DEFAULT 1       
        )
    ''')
    



    # Cart table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER DEFAULT 1,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
            UNIQUE(user_id, product_id)
        )
    ''')
    
    # Wishlist table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS wishlist (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
            UNIQUE(user_id, product_id)
        )
    ''')
    
    # Messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_read BOOLEAN DEFAULT 0
        )
    ''')
    
    # Reviews table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER,
            user_id INTEGER,
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            comment TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_approved BOOLEAN DEFAULT 0,
            FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    ''')

    # User addresses table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_addresses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            address_line1 TEXT NOT NULL,
            address_line2 TEXT,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            zip_code TEXT NOT NULL,
            country TEXT DEFAULT 'USA',
            is_default BOOLEAN DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    ''')
    
    # Orders table (for future e-commerce functionality)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            shipping_address_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
            FOREIGN KEY (shipping_address_id) REFERENCES user_addresses (id)
        )
    ''')
    
    # Order items table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    ''')
    
    # Create indexes for better performance
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id)')


    conn.commit()
    conn.close()



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

@app.route('/admin-interface.html')
def admin_interface():
    return render_template('admin-interface.html')

@app.route('/shop.html')
def shop_page():
    return render_template('shop.html')



# API Routes for Products
@app.route('/api/products')
def get_products():
    conn = get_db_connection()
    products = conn.execute('SELECT * FROM products WHERE is_available = 1').fetchall()
    conn.close()
    
    products_list = []
    for product in products:
        products_list.append(dict(product))
    
    return jsonify(products_list)

@app.route('/api/products/<int:product_id>')
def get_product(product_id):
    conn = get_db_connection()
    product = conn.execute('SELECT * FROM products WHERE id = ? AND is_available = 1', (product_id,)).fetchone()
    conn.close()
    
    if product is None:
        return jsonify({'error': 'Product not found'}), 404
    
    return jsonify(dict(product))

@app.route('/api/products', methods=['POST'])
def create_product():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        data = request.get_json()
        # Add validation for required fields
        required_fields = ['name', 'price', 'category']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        conn = get_db_connection()
        conn.execute(
            'INSERT INTO products (name, brand, price, category, description, image_url, scent, brand_type, mood, season) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            (data['name'], data.get('brand'), data['price'], data['category'], 
             data.get('description'), data.get('image_url'), data.get('scent'), 
             data.get('brand_type'), data.get('mood'), data.get('season'))
        )
        conn.commit()
        conn.close()
    
        return jsonify({'message': 'Product created successfully'})
    
    except Exception as e:
        return jsonify({'error': 'Failed to create product'}), 500

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
        SELECT reviews.*, products.name as product_name, users.full_name as user_name
        FROM reviews 
        JOIN products ON reviews.product_id = products.id 
        JOIN users ON reviews.user_id = users.id
        ORDER BY reviews.created_at DESC
    ''').fetchall()
    conn.close()
    
    reviews_list = []
    for review in reviews:
        reviews_list.append(dict(review))
    
    return jsonify(reviews_list)

@app.route('/api/reviews', methods=['POST'])
@login_required  # Add this to associate reviews with logged-in users
def create_review():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    data = request.get_json()
    
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
        (data['product_id'], user['id'], data['rating'], data['comment'])
    )
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Review submitted successfully'})

# API Routes for Cart
@app.route('/api/cart', methods=['GET'])
@login_required
def get_cart():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT c.*, p.name, p.price, p.image_url, (c.quantity * p.price) as total_price
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ? AND p.is_available = 1
    ''', (user['id'],))
    
    cart_items = cursor.fetchall()
    conn.close()
    
    cart_list = []
    total_cart_value = 0
    
    for item in cart_items:
        item_dict = dict(item)
        cart_list.append(item_dict)
        total_cart_value += item_dict['total_price']
    
    return jsonify({
        'cart_items': cart_list,
        'total_items': len(cart_list),
        'total_value': total_cart_value
    })

@app.route('/api/cart', methods=['POST'])
@login_required
def add_to_cart():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    data = request.get_json()
    
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    if not product_id:
        return jsonify({'error': 'Product ID is required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if product exists and is available
        product = cursor.execute('SELECT * FROM products WHERE id = ? AND is_available = 1', (product_id,)).fetchone()
        if not product:
            return jsonify({'error': 'Product not found or unavailable'}), 404
        
        # Check if item already in cart
        existing_item = cursor.execute(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?', 
            (user['id'], product_id)
        ).fetchone()
        
        if existing_item:
            # Update quantity
            cursor.execute(
                'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                (quantity, user['id'], product_id)
            )
        else:
            # Add new item
            cursor.execute(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                (user['id'], product_id, quantity)
            )
        
        conn.commit()
        return jsonify({'message': 'Product added to cart successfully'})
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': 'Failed to add product to cart'}), 500
    finally:
        conn.close()


@app.route('/api/cart/<int:product_id>', methods=['PUT'])
@login_required
def update_cart_quantity(product_id):
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    data = request.get_json()
    
    quantity = data.get('quantity', 1)
    
    if quantity < 1:
        return jsonify({'error': 'Quantity must be at least 1'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
        (quantity, user['id'], product_id)
    )
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Cart updated successfully'})


@app.route('/api/cart/<int:product_id>', methods=['DELETE'])
@login_required
def remove_from_cart(product_id):
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
        (user['id'], product_id)
    )
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Product removed from cart successfully'})

@app.route('/api/cart/clear', methods=['DELETE'])
@login_required
def clear_cart():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM cart WHERE user_id = ?', (user['id'],))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Cart cleared successfully'})



# Enhanced Wishlist Management
@app.route('/api/wishlist', methods=['GET'])
@login_required
def get_wishlist():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT w.*, p.name, p.price, p.image_url, p.description
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        WHERE w.user_id = ? AND p.is_available = 1
    ''', (user['id'],))
    
    wishlist_items = cursor.fetchall()
    conn.close()
    
    wishlist_list = [dict(item) for item in wishlist_items]
    
    return jsonify({
        'wishlist_items': wishlist_list,
        'total_items': len(wishlist_list)
    })

@app.route('/api/wishlist', methods=['POST'])
@login_required
def add_to_wishlist():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    data = request.get_json()
    
    product_id = data.get('product_id')
    
    if not product_id:
        return jsonify({'error': 'Product ID is required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if product exists and is available
        product = cursor.execute('SELECT * FROM products WHERE id = ? AND is_available = 1', (product_id,)).fetchone()
        if not product:
            return jsonify({'error': 'Product not found or unavailable'}), 404
        
        # Check if already in wishlist
        existing_item = cursor.execute(
            'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?', 
            (user['id'], product_id)
        ).fetchone()
        
        if existing_item:
            return jsonify({'error': 'Product already in wishlist'}), 400
        
        # Add to wishlist
        cursor.execute(
            'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
            (user['id'], product_id)
        )
        
        conn.commit()
        return jsonify({'message': 'Product added to wishlist successfully'})
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': 'Failed to add product to wishlist'}), 500
    finally:
        conn.close()

@app.route('/api/wishlist/<int:product_id>', methods=['DELETE'])
@login_required
def remove_from_wishlist(product_id):
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
        (user['id'], product_id)
    )
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Product removed from wishlist successfully'})

# Admin Authentication
@app.route('/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    admin_username = os.environ.get('ADMIN_USERNAME', 'H&T_Luxe_Scents')
    admin_password = os.environ.get('ADMIN_PASSWORD', 'HamSahLati')
    
    if username == admin_username and password == admin_password:
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

# Enhanced Authentication with better validation
@app.route('/api/auth/login', methods=['POST'])
def api_login():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    if not validate_email(email):
        return jsonify({'error': 'Invalid email format'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Find user by email
    cursor.execute('SELECT * FROM users WHERE email = ? AND is_active = 1', (email,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        # Use generic error message to prevent user enumeration
        return jsonify({'error': 'Invalid credentials'}), 401

    # Verify password
    try:
        if not verify_password(user['password_hash'], password):
            return jsonify({'error': 'Invalid credentials'}), 401
    except Exception:
        return jsonify({'error': 'Invalid credentials'}), 401

    # Create session
    session_token = create_session(user['id'])
    
    # Update last login
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE users SET last_login = datetime("now") WHERE id = ?', (user['id'],))
    conn.commit()
    conn.close()

    return jsonify({
        'message': 'Login successful',
        'user': {
            'id': user['id'],
            'fullName': user['full_name'],
            'email': user['email'],
            'username': user['username']
        },
        'sessionToken': session_token
    })

@app.route('/api/auth/signup', methods=['POST'])
def api_signup():
    conn = None
    
    try:
        data = request.get_json()
        full_name = data.get('fullName', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        # Validation
        if not all([full_name, email, password]):
            return jsonify({'error': 'All fields are required'}), 400

        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400

        is_valid, password_message = validate_password(password)
        if not is_valid:
            return jsonify({'error': password_message}), 400

        if len(full_name) < 2 or len(full_name) > 50:
            return jsonify({'error': 'Full name must be between 2 and 50 characters'}), 400

        # Hash password
        password_hash = hash_password(password)
        username = email.split('@')[0]

        # Database operations
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            return jsonify({'error': 'Email already exists'}), 400

        # Insert user
        cursor.execute(
            'INSERT INTO users (username, email, full_name, password_hash) VALUES (?, ?, ?, ?)',
            (username, email, full_name, password_hash)
        )
        user_id = cursor.lastrowid
        
        # Create session (this will open its own connection)
        session_token = secrets.token_urlsafe(64)
        expires_at = datetime.now() + timedelta(days=30)
        cursor.execute(
            'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
            (user_id, session_token, expires_at)
        )
        
        
        # Commit the user insertion
        conn.commit()
        
        return jsonify({
            'message': 'Account created successfully',
            'user': {
                'id': user_id,
                'fullName': full_name,
                'email': email,
                'username': username
            },
            'sessionToken': session_token
        })
        
    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500
    finally:
        if conn:
            conn.close()







# User profile management
@app.route('/api/user/profile', methods=['GET'])
@login_required
def get_user_profile():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    return jsonify({
        'user': {
            'id': user['id'],
            'fullName': user['full_name'],
            'email': user['email'],
            'username': user['username'],
            'createdAt': user['created_at'],
            'lastLogin': user['last_login']
        }
    })

@app.route('/api/user/profile', methods=['PUT'])
@login_required
def update_user_profile():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    data = request.get_json()
    
    full_name = data.get('fullName', '').strip()
    
    if not full_name or len(full_name) < 2 or len(full_name) > 50:
        return jsonify({'error': 'Full name must be between 2 and 50 characters'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            'UPDATE users SET full_name = ? WHERE id = ?',
            (full_name, user['id'])
        )
        conn.commit()
        
        return jsonify({'message': 'Profile updated successfully'})
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': 'Failed to update profile'}), 500
    finally:
        conn.close()

# Clean up expired sessions (could be run as a periodic task)
def cleanup_expired_sessions():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM user_sessions WHERE expires_at < datetime("now")')
    conn.commit()
    conn.close()


@app.route('/api/auth/me', methods=['GET'])
def api_get_current_user():
    session_token = request.headers.get('Authorization')
    if session_token:
        user = get_user_from_session(session_token)
        if user:
            return jsonify({
                'user': {
                    'id': user['id'],
                    'fullName': user['full_name'],
                    'email': user['email'],
                    'username': user['username']
                }
            })
    
    return jsonify({'error': 'Not authenticated'}), 401


@app.route('/api/user/change-password', methods=['POST'])
@login_required
def change_password():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    data = request.get_json()
    
    current_password = data.get('currentPassword')
    new_password = data.get('newPassword')
    
    if not current_password or not new_password:
        return jsonify({'error': 'Both current and new password are required'}), 400
    
    # Verify current password
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT password_hash FROM users WHERE id = ?', (user['id'],))
    stored_hash = cursor.fetchone()['password_hash']
    
    if not verify_password(stored_hash, current_password):
        conn.close()
        return jsonify({'error': 'Current password is incorrect'}), 401
    
    # Validate new password
    is_valid, password_message = validate_password(new_password)
    if not is_valid:
        conn.close()
        return jsonify({'error': password_message}), 400
    
    # Update password
    new_password_hash = hash_password(new_password)
    cursor.execute(
        'UPDATE users SET password_hash = ? WHERE id = ?',
        (new_password_hash, user['id'])
    )
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Password updated successfully'})



@app.route('/api/auth/logout', methods=['POST'])
def api_logout():
    session_token = request.headers.get('Authorization')
    if session_token:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM user_sessions WHERE session_token = ?', (session_token,))
        conn.commit()
        conn.close()
    
    return jsonify({'message': 'Logged out successfully'})


if __name__ == '__main__':
    
    # Initialize database if it doesn't exist
    db_path = get_db_path()
    
    if not os.path.exists(db_path):
        init_db()

    
    # Clean up expired sessions on startup
    cleanup_expired_sessions()
    
    app.run(debug=True, port=5000)
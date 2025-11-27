from flask import Flask, render_template, request, jsonify, session, send_file
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime, timedelta
import hashlib
import secrets
import bcrypt
import re
import json
import uuid
from werkzeug.utils import secure_filename
from functools import wraps
from dotenv import load_dotenv
import requests
import json
from twilio.rest import Client

load_dotenv()

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'ht-luxe-scents-secret-key-2024')
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
CORS(app)

app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static', 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Database helper functions
def get_db_connection():
    """Get database connection"""
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database', 'ht_luxe_scents.db')
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database with all tables"""
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
    
  
        # Check if users table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        if not cursor.fetchone():
            print("Database tables not found. Creating tables...")
            # Run your schema.sql file if it exists
            schema_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database', 'schema.sql')
            if os.path.exists(schema_path):
                with open(schema_path, 'r') as f:
                    schema_sql = f.read()
                cursor.executescript(schema_sql)
                print("Database schema loaded from schema.sql")
            else:
                # Fallback to creating essential tables
                print("schema.sql not found, creating tables directly...")
                create_essential_tables(cursor)


            # Insert default categories
            default_categories = [
                ("Men's Fragrances", "Sophisticated scents for the modern gentleman", "/static/assets/img/men-category.jpg"),
                ("Women's Fragrances", "Elegant and captivating fragrances for women", "/static/assets/img/women-category.jpg"),
                ("Unisex Fragrances", "Versatile scents that transcend gender", "/static/assets/img/unisex-category.jpg"),
                ("Luxury Collection", "Exclusive premium fragrances", "/static/assets/img/luxury-category.jpg"),
                ("Seasonal Scents", "Fragrances for every season", "/static/assets/img/seasonal-category.jpg")
            ]
                
            for category in default_categories:
                cursor.execute(
                    'INSERT OR IGNORE INTO categories (name, description, image_url) VALUES (?, ?, ?)',
                    category
                )
                
            conn.commit()
            print("Database initialized successfully!")
        else:
            print("Database tables already exist.")

             # ADD THIS: Check and add missing columns to existing tables
            try:
                # Check if phone column exists in users table
                cursor.execute("PRAGMA table_info(users)")
                columns = [column[1] for column in cursor.fetchall()]
                
                if 'phone' not in columns:
                    print("Adding phone column to users table...")
                    cursor.execute("ALTER TABLE users ADD COLUMN phone TEXT")
                
                if 'address' not in columns:
                    print("Adding address column to users table...")
                    cursor.execute("ALTER TABLE users ADD COLUMN address TEXT")
                    
                conn.commit()
                print("Database schema updated successfully!")
                
            except Exception as e:
                print(f"Schema update error: {e}")
                conn.rollback()


    except Exception as e:
        print(f"Database initialization error: {e}")
    finally:
        if conn:
            conn.close()

def create_essential_tables(cursor):
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            phone TEXT, 
            address TEXT, 
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
            image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
        
    # Products table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS products (
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
        )
    ''')
        
    # User sessions table
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
        
    # Orders table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
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
        )
    ''')
        
    # Order items table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            product_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products (id)
        )
    ''')
        
    # Reviews table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
            comment TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_approved BOOLEAN DEFAULT 0,
            FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    ''')
        
        # Messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_read BOOLEAN DEFAULT 0
        )
    ''')
    
        
    # Create indexes
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart(user_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available)')
        
    

# Authentication helper functions
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(stored_hash, provided_password):
    return bcrypt.checkpw(provided_password.encode('utf-8'), stored_hash.encode('utf-8'))

def create_session(user_id):
    session_token = secrets.token_urlsafe(64)
    expires_at = datetime.now() + timedelta(days=30)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
        (user_id, session_token, expires_at)
    )
    conn.commit()
    conn.close()
    return session_token

def get_user_from_session(session_token):
    if not session_token:
        return None
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT u.* FROM users u 
        JOIN user_sessions s ON u.id = s.user_id 
        WHERE s.session_token = ? AND s.expires_at > datetime('now') AND u.is_active = 1
    ''', (session_token,))
    user = cursor.fetchone()
    conn.close()
    return user

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        session_token = request.headers.get('Authorization')
        if not session_token or not get_user_from_session(session_token):
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def send_whatsapp_order_notification(order_data, customer_phone, shipping_address):
    """Send order notification via direct WhatsApp link"""
    try: 
        # Format order message
        order_items = "\n".join([f"• {item['name']} (Qty: {item['quantity']}) - GH₵{item['price']}" 
                               for item in order_data['items']])
        
        message = f"""
🛍️ NEW ORDER RECEIVED!

Order #: {order_data['order_number']}
Customer: {order_data['customer_name']}
Phone: {customer_phone}
Total: GH₵{order_data['total_amount']}

📦 Shipping Address:
{shipping_address}

🛒 Order Items:
{order_items}

Order Date: {order_data['order_date']}
        """.strip()

        # Your business WhatsApp number (without +)
        your_whatsapp_number = "233591373371"  # Your actual number
        
        # Create WhatsApp URL that opens with pre-filled message
        encoded_message = requests.utils.quote(message)
        whatsapp_url = f"https://wa.me/{your_whatsapp_number}?text={encoded_message}"
        
        print("=" * 60)
        print("📱 WHATSAPP ORDER NOTIFICATION READY")
        print("=" * 60)
        print(f"🔗 Click this link to send: {whatsapp_url}")
        print("=" * 60)
        print(f"📝 Message: {message}")
        print("=" * 60)
        return True
        
        
    except Exception as e:
        print(f"WhatsApp notification error: {e}")
        return False


# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/shop')
def shop():
    return render_template('shop.html')

@app.route('/user/dashboard')
def user_dashboard():
    return render_template('user-interface.html')

@app.route('/admin')
def admin_dashboard():
    return render_template('admin-interface.html')

@app.route('/user-interface.html')
def user_interface():
    return render_template('user-interface.html')

# API Routes - Products
@app.route('/api/products')
def get_products():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get filter parameters
    category = request.args.get('category')
    scent_type = request.args.get('scent_type')
    gender = request.args.get('gender')
    min_price = request.args.get('min_price')
    max_price = request.args.get('max_price')
    search = request.args.get('search')
    
    query = '''
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.is_available = 1
    '''
    params = []
    
    if category and category != 'all':
        query += ' AND c.name = ?'
        params.append(category)
    if scent_type and scent_type != 'all':
        query += ' AND p.scent_type = ?'
        params.append(scent_type)
    if gender and gender != 'all':
        query += ' AND p.gender = ?'
        params.append(gender)
    if min_price:
        query += ' AND p.price >= ?'
        params.append(float(min_price))
    if max_price:
        query += ' AND p.price <= ?'
        params.append(float(max_price))
    if search:
        query += ' AND (p.name LIKE ? OR p.brand LIKE ? OR p.description LIKE ?)'
        search_term = f'%{search}%'
        params.extend([search_term, search_term, search_term])
    
    query += ' ORDER BY p.created_at DESC'
    
    cursor.execute(query, params)
    products = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(product) for product in products])

@app.route('/api/products/<int:product_id>')
def get_product(product_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.id = ? AND p.is_available = 1
    ''', (product_id,))
    product = cursor.fetchone()
    conn.close()
    
    if product is None:
        return jsonify({'error': 'Product not found'}), 404
    
    return jsonify(dict(product))

# API Routes - Categories
@app.route('/api/categories')
def get_categories():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM categories ORDER BY name')
    categories = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(category) for category in categories])

# API Routes - Authentication
@app.route('/api/auth/signup', methods=['POST'])
def api_signup():
    try:
        data = request.get_json()
        print(f"Received signup data: {data}")  # Debug
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            

        full_name = data.get('fullName', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        if not all([full_name, email, password]):
            return jsonify({'error': 'All fields are required'}), 400
        
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
       # Simple password hashing (no bcrypt)
        password_hash = hash_password(password)
        username = email.split('@')[0]
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute(
                'INSERT INTO users (username, email, full_name, password_hash) VALUES (?, ?, ?, ?)',
                (username, email, full_name, password_hash)
            )
            user_id = cursor.lastrowid

            session_token = secrets.token_urlsafe(32)
            expires_at = (datetime.now() + timedelta(days=30)).strftime('%Y-%m-%d %H:%M:%S')
            
            cursor.execute(
                'INSERT INTO user_sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
                (user_id, session_token, expires_at)
            )
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
        except sqlite3.IntegrityError:
            conn.rollback()
            return jsonify({'error': 'Email already exists'}), 400
        except Exception as e:
            conn.rollback()
            print(f"Database error: {str(e)}")
            return jsonify({'error': 'Registration failed'}), 500
        finally:
            conn.close()

    except Exception as e:
        print(f"Signup error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    data = request.get_json()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE email = ? AND is_active = 1', (email,))
    user = cursor.fetchone()
    conn.close()
    
    if not user or not verify_password(user['password_hash'], password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
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

@app.route('/api/user/profile', methods=['PUT'])
@login_required
def update_user_profile():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    data = request.get_json()
    
    if not data.get('fullName'):
        return jsonify({'error': 'Full name is required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            'UPDATE users SET full_name = ?, phone = ?, address = ? WHERE id = ?',
            (data['fullName'], data.get('phone', ''), data.get('address', ''), user['id'])
        )
        conn.commit()
        
        # Return updated user data
        cursor.execute('SELECT * FROM users WHERE id = ?', (user['id'],))
        updated_user = cursor.fetchone()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': {
                'id': updated_user['id'],
                'fullName': updated_user['full_name'],
                'email': updated_user['email'],
                'username': updated_user['username'],
                'phone': updated_user['phone'] or '',
                'address': updated_user['address'] or ''
            }
        })
    except Exception as e:
        conn.rollback()
        return jsonify({'error': 'Failed to update profile'}), 500
    finally:
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

@app.route('/api/auth/logout', methods=['POST'])
@login_required
def api_logout():
    session_token = request.headers.get('Authorization')
    if session_token:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM user_sessions WHERE session_token = ?', (session_token,))
        conn.commit()
        conn.close()
    
    return jsonify({'message': 'Logged out successfully'})

# API Routes - Cart
@app.route('/api/cart', methods=['GET'])
@login_required
def get_cart():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT c.*, p.name, p.brand, p.price, p.image_url, (c.quantity * p.price) as total_price
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ? AND p.is_available = 1
    ''', (user['id'],))
    cart_items = cursor.fetchall()
    conn.close()
    
    total = sum(item['total_price'] for item in cart_items)
    
    return jsonify({
        'items': [dict(item) for item in cart_items],
        'total': total,
        'item_count': len(cart_items)
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
        # Check if product exists
        cursor.execute('SELECT * FROM products WHERE id = ? AND is_available = 1', (product_id,))
        product = cursor.fetchone()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Check if item already in cart
        cursor.execute(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?', 
            (user['id'], product_id)
        )
        existing_item = cursor.fetchone()
        
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

@app.route('/api/cart/<int:product_id>', methods=['PUT'])
@login_required
def update_cart_item(product_id):
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

# API Routes - Wishlist
@app.route('/api/wishlist', methods=['GET'])
@login_required
def get_wishlist():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT w.*, p.name, p.brand, p.price, p.image_url, p.description
        FROM wishlist w
        JOIN products p ON w.product_id = p.id
        WHERE w.user_id = ? AND p.is_available = 1
    ''', (user['id'],))
    wishlist_items = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(item) for item in wishlist_items])

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
        # Check if product exists
        cursor.execute('SELECT * FROM products WHERE id = ? AND is_available = 1', (product_id,))
        product = cursor.fetchone()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        # Check if already in wishlist
        cursor.execute(
            'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?', 
            (user['id'], product_id)
        )
        existing_item = cursor.fetchone()
        
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


@app.route('/api/wishlist/clear', methods=['POST'])
@login_required
def clear_wishlist():
    """Clear all items from user's wishlist"""
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Delete all wishlist items for this user
        cursor.execute('DELETE FROM wishlist WHERE user_id = ?', (user['id'],))
        conn.commit()
        
        # Check how many items were removed
        deleted_count = cursor.rowcount
        
        conn.close()
        
        return jsonify({
            'message': f'Cleared {deleted_count} items from wishlist',
            'deleted_count': deleted_count
        })
        
    except Exception as e:
        conn.rollback()
        conn.close()
        print(f"Clear wishlist error: {e}")
        return jsonify({'error': 'Failed to clear wishlist'}), 500

@app.route('/api/checkout', methods=['POST'])
@login_required
def checkout():
    """Process checkout and send WhatsApp notification"""
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    data = request.get_json()
    
    # Get customer phone and shipping address
    customer_phone = data.get('phone', '')
    shipping_address = data.get('shipping_address', '')
    
    if not shipping_address:
        return jsonify({'error': 'Shipping address is required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get cart items
        cursor.execute('''
            SELECT c.*, p.name, p.price, p.brand
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        ''', (user['id'],))
        cart_items = cursor.fetchall()
        
        if not cart_items:
            return jsonify({'error': 'Cart is empty'}), 400
        
        # Calculate total
        total_amount = sum(item['price'] * item['quantity'] for item in cart_items)
        
        # Generate order number
        order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{secrets.token_hex(4).upper()}"
        
        # Create order
        cursor.execute('''
            INSERT INTO orders (user_id, order_number, total_amount, shipping_address, status)
            VALUES (?, ?, ?, ?, ?)
        ''', (user['id'], order_number, total_amount, shipping_address, 'confirmed'))
        
        order_id = cursor.lastrowid
        
        # Add order items
        for item in cart_items:
            cursor.execute('''
                INSERT INTO order_items (order_id, product_id, quantity, unit_price)
                VALUES (?, ?, ?, ?)
            ''', (order_id, item['product_id'], item['quantity'], item['price']))
        
        # Clear cart
        cursor.execute('DELETE FROM cart WHERE user_id = ?', (user['id'],))
        
        conn.commit()
        
        # Prepare order data for WhatsApp
        order_data = {
            'order_number': order_number,
            'order_id': order_id,
            'customer_name': user['full_name'],
            'total_amount': total_amount,
            'order_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'items': [dict(item) for item in cart_items]
        }
        
        # Send WhatsApp notification
        whatsapp_sent = send_whatsapp_order_notification(
            order_data, 
            customer_phone, 
            shipping_address
        )
        
        return jsonify({
            'message': 'Order placed successfully!',
            'order_number': order_number,
            'order_id': order_id,
            'total_amount': total_amount,
            'whatsapp_sent': True,
            'notification': 'Order confirmed! Thank you for your purchase.'
        })
        
    except Exception as e:
        conn.rollback()
        print(f"Checkout error: {str(e)}")
        return jsonify({'error': 'Checkout failed'}), 500
    finally:
        conn.close()

# API Routes - Orders
@app.route('/api/orders', methods=['POST'])
@login_required
def create_order():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get cart items
        cursor.execute('''
            SELECT c.*, p.price, p.name, p.brand
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        ''', (user['id'],))
        cart_items = cursor.fetchall()
        
        if not cart_items:
            return jsonify({'error': 'Cart is empty'}), 400
        
        # Calculate total
        total_amount = sum(item['price'] * item['quantity'] for item in cart_items)
        
        # Generate order number
        order_number = f"ORD-{datetime.now().strftime('%Y%m%d')}-{secrets.token_hex(4).upper()}"
        
        # Create order
        cursor.execute('''
            INSERT INTO orders (user_id, order_number, total_amount, shipping_address, billing_address, customer_notes)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            user['id'], order_number, total_amount,
            data.get('shipping_address', ''),
            data.get('billing_address', ''),
            data.get('customer_notes', '')
        ))
        
        order_id = cursor.lastrowid
        
        # Add order items
        for item in cart_items:
            cursor.execute('''
                INSERT INTO order_items (order_id, product_id, quantity, unit_price)
                VALUES (?, ?, ?, ?)
            ''', (order_id, item['product_id'], item['quantity'], item['price']))
        
        # Clear cart
        cursor.execute('DELETE FROM cart WHERE user_id = ?', (user['id'],))
        
        conn.commit()
        return jsonify({
            'message': 'Order created successfully',
            'order_number': order_number,
            'order_id': order_id,
            'total_amount': total_amount
        })
        
    except Exception as e:
        conn.rollback()
        return jsonify({'error': 'Failed to create order'}), 500
    finally:
        conn.close()

@app.route('/api/orders', methods=['GET'])
@login_required
def get_orders():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT o.*, 
               (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.id) as item_count
        FROM orders o
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
    ''', (user['id'],))
    orders = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(order) for order in orders])

@app.route('/api/debug/all-orders')
def debug_all_orders():
    """Check all orders and their users"""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT o.*, u.email, u.full_name 
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.id
    ''')
    orders = cursor.fetchall()
    conn.close()
    
    orders_list = [dict(order) for order in orders]
    print("🔍 ALL ORDERS IN DATABASE:")
    for order in orders_list:
        print(f"  - Order #{order['order_number']} | User: {order['email']} | Total: GH₵{order['total_amount']}")
    
    return jsonify(orders_list)

@app.route('/api/debug/my-orders')
@login_required
def debug_my_orders():
    """Check orders for current user only"""
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM orders WHERE user_id = ?
    ''', (user['id'],))
    orders = cursor.fetchall()
    conn.close()
    
    orders_list = [dict(order) for order in orders]
    print(f"🔍 ORDERS FOR USER {user['email']}: {len(orders_list)} orders")
    
    return jsonify(orders_list)

@app.route('/api/debug/current-user')
@login_required  
def debug_current_user():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    print(f"🔍 CURRENT USER: ID={user['id']}, Email={user['email']}, Name={user['full_name']}")
    
    return jsonify({
        'current_user': {
            'id': user['id'],
            'email': user['email'], 
            'full_name': user['full_name']
        }
    })

@app.route('/api/orders/<int:order_id>', methods=['GET'])
@login_required
def get_order_details(order_id):
    """Get detailed information for a specific order"""
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get order basic info
        cursor.execute('''
            SELECT o.*, u.full_name, u.email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            WHERE o.id = ? AND o.user_id = ?
        ''', (order_id, user['id']))
        order = cursor.fetchone()
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        # Get order items
        cursor.execute('''
            SELECT oi.*, p.name, p.brand, p.image_url
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        ''', (order_id,))
        order_items = cursor.fetchall()
        
        conn.close()
        
        return jsonify({
            'order': dict(order),
            'items': [dict(item) for item in order_items]
        })
        
    except Exception as e:
        conn.close()
        print(f"Order details error: {e}")
        return jsonify({'error': 'Failed to load order details'}), 500

# Admin API Routes
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # Simple admin authentication (replace with secure method in production)
    admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
    admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
    
    if username == admin_username and password == admin_password:
        session['admin_logged_in'] = True
        return jsonify({'message': 'Login successful'})
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/admin/logout', methods=['POST'])
def admin_logout():
    session.pop('admin_logged_in', None)
    return jsonify({'message': 'Logout successful'})

@app.route('/api/admin/check-auth')
def check_admin_auth():
    if session.get('admin_logged_in'):
        return jsonify({'authenticated': True})
    else:
        return jsonify({'authenticated': False})

@app.route('/api/admin/stats')
def get_dashboard_stats():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    total_products = cursor.execute('SELECT COUNT(*) FROM products').fetchone()[0]
    total_messages = cursor.execute('SELECT COUNT(*) FROM messages').fetchone()[0]
    total_reviews = cursor.execute('SELECT COUNT(*) FROM reviews').fetchone()[0]
    total_users = cursor.execute('SELECT COUNT(*) FROM users').fetchone()[0]
    
    conn.close()
    
    return jsonify({
        'total_products': total_products,
        'total_messages': total_messages,
        'total_reviews': total_reviews,
        'total_users': total_users
    })

@app.route('/api/admin/products', methods=['POST'])
def add_product():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    # Handle form data with file upload
    if request.content_type and 'multipart/form-data' in request.content_type:
        name = request.form.get('name')
        brand = request.form.get('brand')
        price = request.form.get('price')
        category_id = request.form.get('category_id')
        description = request.form.get('description')
        scent_type = request.form.get('scent_type')
        gender = request.form.get('gender')
        mood = request.form.get('mood')
        season = request.form.get('season')
        stock_quantity = request.form.get('stock_quantity')
        
        # Handle image upload
        image_url = '/static/assets/img/placeholder.jpg'  # default
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                # Generate unique filename
                unique_filename = f"{uuid.uuid4().hex}_{filename}"
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                file.save(file_path)
                image_url = f'/static/uploads/{unique_filename}'
    else:
        # Handle JSON data (existing functionality)
        data = request.get_json()
        name = data.get('name')
        brand = data.get('brand')
        price = data.get('price')
        category_id = data.get('category_id')
        description = data.get('description', '')
        image_url = data.get('image_url', '/static/assets/img/placeholder.jpg')
        scent_type = data.get('scent_type', '')
        gender = data.get('gender', 'unisex')
        mood = data.get('mood', '')
        season = data.get('season', '')
        stock_quantity = data.get('stock_quantity', 0)
    
    # Validation
    required_fields = ['name', 'brand', 'price', 'category_id']
    for field in required_fields:
        if not locals().get(field):
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO products (name, brand, price, category_id, description, image_url, scent_type, gender, mood, season, stock_quantity)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            name, brand, float(price), int(category_id),
            description, image_url, scent_type, gender, mood, season,
            int(stock_quantity)
        ))
        
        conn.commit()
        return jsonify({'message': 'Product added successfully'})
        
    except Exception as e:
        conn.rollback()
        print(f"Error adding product: {str(e)}")
        return jsonify({'error': 'Failed to add product'}), 500
    finally:
        conn.close()

@app.route('/api/admin/categories', methods=['POST'])
def add_category():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    data = request.get_json()
    
    if not data.get('name'):
        return jsonify({'error': 'Category name is required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            'INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)',
            (data['name'], data.get('description', ''), data.get('image_url', '/static/assets/img/placeholder.jpg'))
        )
        
        conn.commit()
        return jsonify({'message': 'Category added successfully'})
        
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Category name already exists'}), 400
    except Exception as e:
        conn.rollback()
        return jsonify({'error': 'Failed to add category'}), 500
    finally:
        conn.close()

@app.route('/api/admin/messages')
def get_messages():
    if not session.get('admin_logged_in'):
        return jsonify({'error': 'Unauthorized'}), 401
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM messages ORDER BY created_at DESC')
    messages = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(message) for message in messages])

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.get_json()
    
    if not all([data.get('name'), data.get('email'), data.get('message')]):
        return jsonify({'error': 'All fields are required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
        (data['name'], data['email'], data.get('subject', ''), data['message'])
    )
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Message sent successfully'})

# Clean up expired sessions
def cleanup_expired_sessions():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM user_sessions WHERE expires_at < datetime("now")')
    conn.commit()
    conn.close()

if __name__ == '__main__':
    # Create database directory if it doesn't exist
    db_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database')
    os.makedirs(db_dir, exist_ok=True)

    # Create uploads directory if it doesn't exist
    uploads_dir = app.config['UPLOAD_FOLDER']
    os.makedirs(uploads_dir, exist_ok=True)
    
    # Initialize database
    init_db()
    
    # Clean up expired sessions
    cleanup_expired_sessions()
    
    print("H&T Luxe Scents starting on http://localhost:5000")
    app.run(debug=True, port=5000)
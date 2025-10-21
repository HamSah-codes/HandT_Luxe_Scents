from flask import jsonify, request, session
from backend.models import Product, Category, Message, Review, User
import sqlite3

# Database connection helper (duplicated from app.py for routes module)
def get_db_connection():
    conn = sqlite3.connect('../database/ht_luxe_scents.db')
    conn.row_factory = sqlite3.Row
    return conn

# Product routes
def register_product_routes(app):
    @app.route('/api/products', methods=['GET'])
    def get_products():
        conn = get_db_connection()
        products = conn.execute('SELECT * FROM products').fetchall()
        conn.close()
        
        products_list = []
        for product in products:
            products_list.append(dict(product))
        
        return jsonify(products_list)

    @app.route('/api/products/<int:product_id>', methods=['GET'])
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
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO products (name, brand, price, category, description, image_url, scent, brand_type, mood, season) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            (data['name'], data['brand'], data['price'], data['category'], data['description'], 
             data['image_url'], data.get('scent'), data.get('brand_type'), data.get('mood'), data.get('season'))
        )
        product_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Product created successfully', 'id': product_id})

# Category routes
def register_category_routes(app):
    @app.route('/api/categories', methods=['GET'])
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
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            (data['name'], data['description'])
        )
        category_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Category created successfully', 'id': category_id})

# Message routes
def register_message_routes(app):
    @app.route('/api/messages', methods=['GET'])
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
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO messages (name, email, message) VALUES (?, ?, ?)',
            (data['name'], data['email'], data['message'])
        )
        message_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Message submitted successfully', 'id': message_id})

# Review routes
def register_review_routes(app):
    @app.route('/api/reviews', methods=['GET'])
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
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?, ?, ?, ?)',
            (data['product_id'], data['user_name'], data['rating'], data['comment'])
        )
        review_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({'message': 'Review submitted successfully', 'id': review_id})
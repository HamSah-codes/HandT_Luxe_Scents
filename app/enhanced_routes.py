from flask import jsonify, request
from app import app, get_db_connection, login_required
from datetime import datetime

# Additional API routes for enhanced user dashboard

@app.route('/api/user/orders', methods=['GET'])
@login_required
def get_user_orders():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT o.*, 
               GROUP_CONCAT(p.name || ' (x' || oi.quantity || ')') as item_names,
               COUNT(oi.id) as item_count
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.order_date DESC
    ''', (user['id'],))
    
    orders = cursor.fetchall()
    conn.close()
    
    orders_list = []
    for order in orders:
        order_dict = dict(order)
        orders_list.append(order_dict)
    
    return jsonify(orders_list)

@app.route('/api/user/orders/recent', methods=['GET'])
@login_required
def get_recent_orders():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT o.*, 
               GROUP_CONCAT(p.name || ' (x' || oi.quantity || ')') as item_names
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
        GROUP BY o.id
        ORDER BY o.order_date DESC
        LIMIT 5
    ''', (user['id'],))
    
    orders = cursor.fetchall()
    conn.close()
    
    orders_list = []
    for order in orders:
        order_dict = dict(order)
        orders_list.append(order_dict)
    
    return jsonify(orders_list)

@app.route('/api/user/orders/count', methods=['GET'])
@login_required
def get_orders_count():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) as count FROM orders WHERE user_id = ?', (user['id'],))
    result = cursor.fetchone()
    conn.close()
    
    return jsonify({'count': result['count']})

@app.route('/api/user/addresses', methods=['GET'])
@login_required
def get_user_addresses():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM user_addresses 
        WHERE user_id = ? 
        ORDER BY is_default DESC, id DESC
    ''', (user['id'],))
    
    addresses = cursor.fetchall()
    conn.close()
    
    addresses_list = []
    for address in addresses:
        addresses_list.append(dict(address))
    
    return jsonify(addresses_list)

@app.route('/api/user/addresses', methods=['POST'])
@login_required
def add_user_address():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    data = request.get_json()
    
    # If this is set as default, remove default from other addresses
    if data.get('is_default'):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('UPDATE user_addresses SET is_default = 0 WHERE user_id = ?', (user['id'],))
        conn.commit()
        conn.close()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO user_addresses 
        (user_id, address_line1, address_line2, city, state, zip_code, country, is_default)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        user['id'], 
        data['address_line1'], 
        data.get('address_line2'), 
        data['city'], 
        data['state'], 
        data['zip_code'], 
        data.get('country', 'Ghana'), 
        data.get('is_default', False)
    ))
    
    address_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Address added successfully', 'id': address_id})

@app.route('/api/user/reviews', methods=['GET'])
@login_required
def get_user_reviews():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT r.*, p.name as product_name, p.image_url
        FROM reviews r
        JOIN products p ON r.product_id = p.id
        WHERE r.user_id = ?
        ORDER BY r.created_at DESC
    ''', (user['id'],))
    
    reviews = cursor.fetchall()
    conn.close()
    
    reviews_list = []
    for review in reviews:
        reviews_list.append(dict(review))
    
    return jsonify(reviews_list)

@app.route('/api/user/reviews/count', methods=['GET'])
@login_required
def get_reviews_count():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) as count FROM reviews WHERE user_id = ?', (user['id'],))
    result = cursor.fetchone()
    conn.close()
    
    return jsonify({'count': result['count']})

@app.route('/api/support/messages', methods=['POST'])
@login_required
def create_support_message():
    session_token = request.headers.get('Authorization')
    user = get_user_from_session(session_token)
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO messages (name, email, message, subject)
        VALUES (?, ?, ?, ?)
    ''', (user['full_name'], user['email'], data['message'], data['subject']))
    
    message_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Support message sent successfully', 'id': message_id})

# Helper function to get user from session (duplicated from app.py for completeness)
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

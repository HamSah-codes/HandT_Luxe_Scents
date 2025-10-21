from datetime import datetime

# Product model
class Product:
    def __init__(self, id, name, brand, price, category, description, image_url, scent=None, brand_type=None, mood=None, season=None, created_at=None):
        self.id = id
        self.name = name
        self.brand = brand
        self.price = price
        self.category = category
        self.description = description
        self.image_url = image_url
        self.scent = scent
        self.brand_type = brand_type
        self.mood = mood
        self.season = season
        self.created_at = created_at or datetime.now()

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'brand': self.brand,
            'price': float(self.price),
            'category': self.category,
            'description': self.description,
            'image_url': self.image_url,
            'scent': self.scent,
            'brand_type': self.brand_type,
            'mood': self.mood,
            'season': self.season,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# Category model
class Category:
    def __init__(self, id, name, description, created_at=None):
        self.id = id
        self.name = name
        self.description = description
        self.created_at = created_at or datetime.now()

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# Message model
class Message:
    def __init__(self, id, name, email, message, created_at=None):
        self.id = id
        self.name = name
        self.email = email
        self.message = message
        self.created_at = created_at or datetime.now()

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'message': self.message,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# Review model
class Review:
    def __init__(self, id, product_id, user_name, rating, comment, created_at=None):
        self.id = id
        self.product_id = product_id
        self.user_name = user_name
        self.rating = rating
        self.comment = comment
        self.created_at = created_at or datetime.now()

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'user_name': self.user_name,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# User model (simplified)
class User:
    def __init__(self, id, username, email, created_at=None):
        self.id = id
        self.username = username
        self.email = email
        self.created_at = created_at or datetime.now()

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
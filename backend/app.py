from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from extensions import db, jwt

# Import Blueprints
from routes.auth_routes import auth_bp
from routes.admin_routes import admin_bp
from routes.issue_routes import issue_bp

# Import Models for database discovery
from models.user import User
from models.book import Book
from models.issued_book import IssuedBook
from models.reservation import Reservation


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # 1. Initialize Extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # 2. CORS Setup (Production Ready)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # 3. Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(issue_bp, url_prefix="/api")

    # 4. Global Error Handlers (Standard Practice)
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error"}), 500

    # 5. Database Initialization
    with app.app_context():
        db.create_all()

    @app.route("/")
    def index():
        return jsonify({
            "name": "Library Management System API",
            "version": "2.0",
            "status": "Operational"
        })

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)

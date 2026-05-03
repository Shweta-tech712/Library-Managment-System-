from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from extensions import db
from models.book import Book

admin_bp = Blueprint("admin", __name__)

# Helper: admin check
def admin_only():
    claims = get_jwt()
    return claims.get("role") == "admin"


@admin_bp.route("/books", methods=["POST"])
@jwt_required()
def add_book():
    if not admin_only():
        return jsonify({"message": "Admin access required"}), 403

    data = request.json

    book = Book(
        title=data["title"],
        author=data["author"],
        category=data.get("category"),
        total_copies=data["total_copies"],
        available_copies=data["total_copies"]
    )

    db.session.add(book)
    db.session.commit()

    return jsonify({"message": "Book added successfully"}), 201


@admin_bp.route("/books", methods=["GET"])
@jwt_required()
def get_books():
    if not admin_only():
        return jsonify({"message": "Admin access required"}), 403

    books = Book.query.all()

    return jsonify([
        {
            "id": b.id,
            "title": b.title,
            "author": b.author,
            "category": b.category,
            "total_copies": b.total_copies,
            "available_copies": b.available_copies
        } for b in books
    ]), 200


@admin_bp.route("/books/<int:book_id>", methods=["PUT"])
@jwt_required()
def update_book(book_id):
    if not admin_only():
        return jsonify({"message": "Admin access required"}), 403

    book = Book.query.get_or_404(book_id)
    data = request.json

    book.title = data.get("title", book.title)
    book.author = data.get("author", book.author)
    book.category = data.get("category", book.category)
    book.total_copies = data.get("total_copies", book.total_copies)

    if book.available_copies > book.total_copies:
        book.available_copies = book.total_copies

    db.session.commit()

    return jsonify({"message": "Book updated"}), 200


@admin_bp.route("/books/<int:book_id>", methods=["DELETE"])
@jwt_required()
def delete_book(book_id):
    if not admin_only():
        return jsonify({"message": "Admin access required"}), 403

    book = Book.query.get_or_404(book_id)

    db.session.delete(book)
    db.session.commit()

    return jsonify({"message": "Book deleted"}), 200

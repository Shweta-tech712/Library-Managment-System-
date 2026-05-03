from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from extensions import db
from datetime import date, timedelta

from models.issued_book import IssuedBook
from models.book import Book
from models.user import User

issue_bp = Blueprint("issue", __name__)

@issue_bp.route("/admin/issued-books", methods=["GET"])
@jwt_required()
def get_issued_books():
    records = IssuedBook.query.all()
    result = []

    for r in records:
        book = Book.query.get(r.book_id)
        user = User.query.get(r.user_id)

        result.append({
            "id": r.id,
            "book_title": book.title if book else "Unknown",
            "user_name": user.name if user else "Unknown",
            "issue_date": r.issue_date.isoformat() if r.issue_date else None,
            "due_date": r.due_date.isoformat() if r.due_date else None,
            "returned": r.return_date is not None,
            "fine": r.fine
        })

    return jsonify(result), 200

@issue_bp.route("/issue", methods=["POST"])
@jwt_required()
def issue_book():
    data = request.json
    book_id = data.get("book_id")
    user_id = data.get("user_id")

    book = Book.query.get(book_id)
    if not book or book.available_copies <= 0:
        return jsonify({"message": "Book not available"}), 400

    issue = IssuedBook(
        book_id=book_id,
        user_id=user_id,
        issue_date=date.today(),
        due_date=date.today() + timedelta(days=14)
    )

    book.available_copies -= 1
    db.session.add(issue)
    db.session.commit()

    return jsonify({"message": "Book issued successfully"}), 201

@issue_bp.route("/return", methods=["POST"])
@jwt_required()
def return_book():
    data = request.json
    book_id = data.get("book_id")
    user_id = data.get("user_id")

    # Find the active issue record
    record = IssuedBook.query.filter_by(
        book_id=book_id, 
        user_id=user_id, 
        return_date=None
    ).first()

    if not record:
        return jsonify({"message": "No active issue record found"}), 404

    record.return_date = date.today()
    
    book = Book.query.get(book_id)
    if book:
        book.available_copies += 1

    db.session.commit()
    return jsonify({"message": "Book returned successfully"}), 200


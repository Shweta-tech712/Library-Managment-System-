from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.issue_service import IssueService
from middleware.auth_middleware import roles_required
from models.issued_book import IssuedBook
from models.book import Book
from models.user import User
from models.reservation import Reservation
from datetime import date

issue_bp = Blueprint("issue_api", __name__)

@issue_bp.route("/issue", methods=["POST"])
@jwt_required()
@roles_required("admin")
def handle_issue():
    data = request.json
    book_id = data.get("book_id")
    user_id = data.get("user_id")
    due_date = data.get("due_date")
    return IssueService.issue_book(book_id, user_id, due_date)

@issue_bp.route("/return", methods=["POST"])
@jwt_required()
@roles_required("admin")
def handle_return_old():
    data = request.json
    book_id = data.get("book_id")
    user_id = data.get("user_id")
    return IssueService.return_book(book_id, user_id)

@issue_bp.route("/return-book/<int:issue_id>", methods=["PUT"])
@jwt_required()
@roles_required("admin")
def handle_return_by_id(issue_id):
    return IssueService.return_book_by_id(issue_id)

@issue_bp.route("/admin/all-issues", methods=["GET"])
@jwt_required()
@roles_required("admin")
def get_all_issues():
    status_filter = request.args.get("status")
    
    records = IssuedBook.query.all()
    res = []
    for r in records:
        # Apply manual status filtering for simplicity, or use hybrid properties in a real app
        if status_filter and r.status.lower() != status_filter.lower():
            continue
            
        b = Book.query.get(r.book_id)
        u = User.query.get(r.user_id)
        res.append({
            "id": r.id,
            "book_id": r.book_id,
            "user_id": r.user_id,
            "book_title": b.title if b else "Deleted",
            "user_name": u.name if u else "Deleted",
            "issue_date": r.issue_date.isoformat(),
            "due_date": r.due_date.isoformat(),
            "return_date": r.return_date.isoformat() if r.return_date else None,
            "status": r.status,
            "fine": r.fine_amount
        })
    return jsonify(res), 200

@issue_bp.route("/books", methods=["GET"])
def get_books():
    # Public route for listing books with search, filters, and pagination
    search = request.args.get("search", "")
    category = request.args.get("category", "")
    status = request.args.get("status", "all").lower()
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    
    query = Book.query
    
    if search:
        query = query.filter((Book.title.ilike(f"%{search}%")) | (Book.author.ilike(f"%{search}%")))
    if category and category != "All Categories":
        query = query.filter(Book.category == category)
        
    if status == "available":
        query = query.filter(Book.available_copies > 0)
    elif status == "issued":
        query = query.filter(Book.available_copies < Book.total_copies)
    elif status == "overdue":
        # Join with IssuedBook to find books that have active overdue issues
        query = query.join(IssuedBook).filter(
            IssuedBook.return_date == None,
            IssuedBook.due_date < date.today()
        )

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    books = pagination.items
    
    return jsonify({
        "books": [{
            "id": b.id,
            "title": b.title,
            "author": b.author,
            "category": b.category,
            "total_copies": b.total_copies,
            "available_copies": b.available_copies
        } for b in books],
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page
    }), 200

@issue_bp.route("/books/<int:book_id>", methods=["GET"])
def get_book_details(book_id):
    book = Book.query.get_or_404(book_id)
    
    # Fetch issue history for this book
    issues = IssuedBook.query.filter_by(book_id=book_id).all()
    history = []
    
    for issue in issues:
        user = User.query.get(issue.user_id)
        history.append({
            "id": issue.id,
            "user_name": user.name if user else "Deleted User",
            "issue_date": issue.issue_date.isoformat(),
            "due_date": issue.due_date.isoformat(),
            "return_date": issue.return_date.isoformat() if issue.return_date else None,
            "status": issue.status,
            "fine": issue.fine_amount
        })
        
    return jsonify({
        "id": book.id,
        "title": book.title,
        "author": book.author,
        "category": book.category,
        "total_copies": book.total_copies,
        "available_copies": book.available_copies,
        "history": history
    }), 200

@issue_bp.route("/books/<int:book_id>/reserve", methods=["POST"])
@jwt_required()
@roles_required("admin")
def reserve_book(book_id):
    data = request.json
    user_id = data.get("user_id")
    
    book = Book.query.get_or_404(book_id)
    if book.available_copies > 0:
        return jsonify({"message": "Book is currently available, no need to reserve."}), 400
        
    # Check if user already has an active reservation
    existing = Reservation.query.filter_by(book_id=book_id, user_id=user_id, status="Pending").first()
    if existing:
        return jsonify({"message": "User is already in the waitlist for this book."}), 400
        
    res = Reservation(user_id=user_id, book_id=book_id)
    from extensions import db
    db.session.add(res)
    db.session.commit()
    
    return jsonify({"message": "User added to reservation waitlist."}), 201

@issue_bp.route("/books/<int:book_id>/reservations", methods=["GET"])
@jwt_required()
def get_reservations(book_id):
    reservations = Reservation.query.filter_by(book_id=book_id).order_by(Reservation.reservation_date.asc()).all()
    res = []
    for r in reservations:
        u = User.query.get(r.user_id)
        res.append({
            "id": r.id,
            "user_name": u.name if u else "Unknown",
            "user_email": u.email if u else "Unknown",
            "reservation_date": r.reservation_date.isoformat(),
            "status": r.status
        })
    return jsonify(res), 200

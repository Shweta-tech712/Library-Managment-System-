from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from extensions import db
from models.book import Book
from models.user import User
from models.issued_book import IssuedBook
from middleware.auth_middleware import admin_required
from services.issue_service import IssueService

admin_bp = Blueprint("admin_api", __name__)

@admin_bp.route("/dashboard", methods=["GET"])
@jwt_required()
@admin_required
def get_dashboard_summary():
    # 1. Total Inventory (Sum of all copies)
    total_books = db.session.query(db.func.sum(Book.total_copies)).scalar() or 0
    
    # 2. Total Available
    total_available = db.session.query(db.func.sum(Book.available_copies)).scalar() or 0
    
    # 3. Total Issued (Active only)
    total_issued = IssuedBook.query.filter_by(return_date=None).count()
    
    # 4. Overdue Books
    overdue_books = IssueService.get_overdue_stats()
    
    # 5. Total Users
    total_users = User.query.count()
    
    return jsonify({
        "total_books": int(total_books),
        "total_available": int(total_available),
        "total_issued": total_issued,
        "overdue_books": overdue_books,
        "total_users": total_users
    }), 200

@admin_bp.route("/books/manage", methods=["POST"])
@jwt_required()
@admin_required
def add_book():
    data = request.json
    book = Book(
        title=data["title"],
        author=data["author"],
        category=data.get("category", "General"),
        total_copies=data["total_copies"],
        available_copies=data["total_copies"]
    )
    db.session.add(book)
    db.session.commit()
    return jsonify({"message": "Book added successfully"}), 201

@admin_bp.route("/books/<int:book_id>", methods=["PUT"])
@jwt_required()
@admin_required
def edit_book(book_id):
    book = Book.query.get_or_404(book_id)
    data = request.json
    
    # Calculate difference in total copies to update available_copies
    diff = data["total_copies"] - book.total_copies
    book.total_copies = data["total_copies"]
    book.available_copies += diff
    
    book.title = data.get("title", book.title)
    book.author = data.get("author", book.author)
    book.category = data.get("category", book.category)
    
    db.session.commit()
    return jsonify({"message": "Book updated successfully"}), 200

@admin_bp.route("/books/<int:book_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_book(book_id):
    book = Book.query.get_or_404(book_id)
    
    # Check if any copies are currently issued
    if book.available_copies < book.total_copies:
        return jsonify({"message": "Cannot delete book while copies are still issued"}), 400
        
    db.session.delete(book)
    db.session.commit()
    return jsonify({"message": "Book deleted successfully"}), 200

@admin_bp.route("/users", methods=["GET"])
@jwt_required()
@admin_required
def get_all_users():
    users = User.query.all()
    # Add active issues count for each user
    res = []
    for u in users:
        active_issues = IssuedBook.query.filter_by(user_id=u.id, return_date=None).count()
        res.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "active_issues": active_issues
        })
    return jsonify(res), 200

@admin_bp.route("/users", methods=["POST"])
@jwt_required()
@admin_required
def create_user():
    data = request.json
    if User.query.filter_by(email=data.get("email")).first():
        return jsonify({"message": "User with this email already exists"}), 400

    user = User(
        name=data["name"],
        email=data["email"],
        role=data.get("role", "student")
    )
    user.set_password(data["password"])
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({"message": "User created successfully", "id": user.id}), 201

@admin_bp.route("/users/<int:user_id>", methods=["PUT"])
@jwt_required()
@admin_required
def edit_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json
    
    # Check email uniqueness if email is changed
    if "email" in data and data["email"] != user.email:
        if User.query.filter_by(email=data["email"]).first():
            return jsonify({"message": "Email already in use"}), 400
            
    user.name = data.get("name", user.name)
    user.email = data.get("email", user.email)
    user.role = data.get("role", user.role)
    
    if data.get("password"):
        user.set_password(data["password"])
        
    db.session.commit()
    return jsonify({"message": "User updated successfully"}), 200

@admin_bp.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    
    # Check if user has active issues
    active_issues = IssuedBook.query.filter_by(user_id=user_id, return_date=None).count()
    if active_issues > 0:
        return jsonify({"message": "Cannot delete user with active issued books"}), 400
        
    # Optional: Delete history or keep it. Let's delete it for simplicity or cascade
    IssuedBook.query.filter_by(user_id=user_id).delete()
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200

@admin_bp.route("/users/<int:user_id>/issues", methods=["GET"])
@jwt_required()
@admin_required
def get_user_issues(user_id):
    issues = IssuedBook.query.filter_by(user_id=user_id).all()
    res = []
    for r in issues:
        b = Book.query.get(r.book_id)
        res.append({
            "id": r.id,
            "book_title": b.title if b else "Deleted Book",
            "issue_date": r.issue_date.isoformat(),
            "due_date": r.due_date.isoformat(),
            "return_date": r.return_date.isoformat() if r.return_date else None,
            "status": r.status,
            "fine": r.fine_amount
        })
    return jsonify(res), 200

@admin_bp.route("/dashboard/analytics", methods=["GET"])
@jwt_required()
@admin_required
def get_dashboard_analytics():
    from datetime import date, timedelta
    
    # 1. Category Distribution
    category_data = db.session.query(Book.category, db.func.count(Book.id)).group_by(Book.category).all()
    categories = [{"name": c[0], "count": c[1]} for c in category_data]
    
    # 2. Recent Issues Timeline (Last 7 Days)
    seven_days_ago = date.today() - timedelta(days=6)
    recent_data = db.session.query(IssuedBook.issue_date, db.func.count(IssuedBook.id))\
        .filter(IssuedBook.issue_date >= seven_days_ago)\
        .group_by(IssuedBook.issue_date).all()
        
    # Convert to a dictionary for easy mapping
    recent_dict = {str(d[0]): d[1] for d in recent_data}
    
    # Ensure all 7 days are represented, even if 0
    recent_issues = []
    for i in range(7):
        current_date = seven_days_ago + timedelta(days=i)
        date_str = str(current_date)
        recent_issues.append({
            "date": current_date.strftime("%b %d"),
            "count": recent_dict.get(date_str, 0)
        })
        
    # 3. Top Books
    top_data = db.session.query(Book.title, db.func.count(IssuedBook.id).label('total'))\
        .join(IssuedBook, Book.id == IssuedBook.book_id)\
        .group_by(Book.title)\
        .order_by(db.desc('total'))\
        .limit(5).all()
        
    top_books = [{"title": t[0], "count": t[1]} for t in top_data]
    
    return jsonify({
        "categories": categories,
        "recent_issues": recent_issues,
        "top_books": top_books
    }), 200

@admin_bp.route("/fines", methods=["GET"])
@jwt_required()
@admin_required
def get_all_fines():
    # Get all issued books where fine_amount > 0
    records = IssuedBook.query.filter(IssuedBook.fine_amount > 0).all()
    res = []
    for r in records:
        u = User.query.get(r.user_id)
        b = Book.query.get(r.book_id)
        res.append({
            "id": r.id,
            "user_name": u.name if u else "Unknown",
            "user_email": u.email if u else "Unknown",
            "book_title": b.title if b else "Deleted Book",
            "due_date": r.due_date.isoformat(),
            "return_date": r.return_date.isoformat() if r.return_date else None,
            "fine_amount": r.fine_amount,
            "fine_status": r.fine_status
        })
    return jsonify(res), 200

@admin_bp.route("/fines/<int:issue_id>/pay", methods=["PUT"])
@jwt_required()
@admin_required
def pay_fine(issue_id):
    record = IssuedBook.query.get_or_404(issue_id)
    if record.fine_status == "Paid":
        return jsonify({"message": "Fine is already paid"}), 400
        
    record.fine_status = "Paid"
    db.session.commit()
    return jsonify({"message": "Fine marked as paid successfully"}), 200

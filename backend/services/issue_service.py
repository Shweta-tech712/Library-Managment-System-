from datetime import date, timedelta
from extensions import db
from models.book import Book
from models.issued_book import IssuedBook
from models.reservation import Reservation
from config import Config

class IssueService:
    @staticmethod
    def issue_book(book_id, user_id, due_date=None):
        book = Book.query.get(book_id)
        
        if not book:
            return {"error": "Book not found"}, 404
            
        if book.available_copies <= 0:
            return {"error": "No copies available for issue"}, 400
            
        # Check if user already has this book issued and not returned
        existing = IssuedBook.query.filter_by(
            user_id=user_id, 
            book_id=book_id, 
            return_date=None
        ).first()
        
        if existing:
            return {"error": "User already has an active issue for this book"}, 400

        # Handle custom due date or default
        if due_date:
            final_due_date = date.fromisoformat(due_date)
        else:
            final_due_date = date.today() + timedelta(days=14)

        # Create new issue record
        new_issue = IssuedBook(
            user_id=user_id,
            book_id=book_id,
            issue_date=date.today(),
            due_date=final_due_date
        )
        
        # Update book availability
        book.available_copies -= 1
        
        db.session.add(new_issue)
        db.session.commit()
        
        return {"message": "Book issued successfully", "due_date": new_issue.due_date.isoformat()}, 201

    @staticmethod
    def return_book_by_id(issue_id):
        record = IssuedBook.query.get(issue_id)
        
        if not record:
            return {"error": "Issuance record not found"}, 404
            
        if record.return_date:
            return {"error": "Book already returned"}, 400
            
        # Calculate fine
        today = date.today()
        record.return_date = today
        
        fine = 0
        if today > record.due_date:
            days_late = (today - record.due_date).days
            fine = days_late * Config.DAILY_FINE_RATE
            
        record.fine_amount = fine
        if fine > 0:
            record.fine_status = "Unpaid"
        else:
            record.fine_status = "None"
        
        # Restore book copy and handle reservations
        book = Book.query.get(record.book_id)
        if book:
            book.available_copies += 1
            
            # Check for pending reservations
            next_res = Reservation.query.filter_by(book_id=book.id, status="Pending").order_by(Reservation.reservation_date.asc()).first()
            if next_res:
                next_res.status = "Available for Pickup"
                # Keep available_copies incremented, but next_res gets priority. In a fully robust system, 
                # we might deduct available_copies and mark it "Reserved" state, but this works for now.
            
        db.session.commit()
        
        return {
            "message": "Book returned successfully",
            "fine_amount": fine,
            "status": "Returned"
        }, 200

    @staticmethod
    def return_book(book_id, user_id):
        record = IssuedBook.query.filter_by(
            user_id=user_id, 
            book_id=book_id, 
            return_date=None
        ).first()
        if record:
            return IssueService.return_book_by_id(record.id)
        return {"error": "No active issue record found"}, 404
    @staticmethod
    def get_overdue_stats():
        today = date.today()
        overdue_count = IssuedBook.query.filter(
            IssuedBook.return_date == None,
            IssuedBook.due_date < today
        ).count()
        return overdue_count

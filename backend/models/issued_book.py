from extensions import db
from datetime import datetime, date

class IssuedBook(db.Model):
    __tablename__ = "issued_books"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey("books.id"), nullable=False)
    
    issue_date = db.Column(db.Date, default=date.today, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    return_date = db.Column(db.Date, nullable=True)
    fine_amount = db.Column(db.Float, default=0.0)
    fine_status = db.Column(db.String(20), default="None") # "None", "Unpaid", "Paid"
    
    # Status property for professional tracking
    @property
    def status(self):
        if self.return_date:
            return "Returned"
        if date.today() > self.due_date:
            return "Overdue"
        return "Pending"

    def __repr__(self):
        return f"<IssuedBook {self.id} | User {self.user_id} | Book {self.book_id}>"

from extensions import db
from datetime import datetime

class Reservation(db.Model):
    __tablename__ = "reservations"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey("books.id"), nullable=False)
    
    reservation_date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    status = db.Column(db.String(20), default="Pending") # "Pending", "Fulfilled", "Cancelled"

    def __repr__(self):
        return f"<Reservation {self.id} | User {self.user_id} | Book {self.book_id} | Status {self.status}>"

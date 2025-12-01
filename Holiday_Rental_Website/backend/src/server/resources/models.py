from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(20), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    selected_apartment = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f"Booking('{self.email}', '{self.start_date}-{self.end_date}', '{self.selected_apartment}')"


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f"User('{self.name}', '{self.email}')"


# Rating by user for each apartment once
class Rating(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(120), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    review = db.Column(db.String(120), nullable=False)
    apartment = db.Column(db.String(1), nullable=False)

    def __repr__(self):
        return f"Rating('{self.email}', '{self.rating}')"

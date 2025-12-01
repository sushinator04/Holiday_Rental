from flask import Flask, request, jsonify, render_template
from datetime import datetime
from sqlalchemy import and_, or_
from flask_cors import CORS
from server.resources.models import db, Booking, User, Rating
import time
import logging
import warnings
import smtplib
from email.mime.text import MIMEText
import argparse
from server.router.routes import add_routes
import os


def create_app():
    app = Flask(__name__, template_folder="templates")
    CORS(app, resources={r"/*": {"origins": "*"}})
    add_routes(app)
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///database.db"
    db.init_app(app)
    with app.app_context():
        db.create_all()

    @app.route("/")
    def home():
        """Just a simple welcome message"""
        return "Welcome to the backend!"

    # clear database
    @app.route("/clear", methods=["DELETE"])
    def clear_db():
        """Clear the database"""
        db.drop_all()
        db.create_all()
        return jsonify({"message": "Database cleared successfully"}), 200

    @app.route("/booking", methods=["POST"])
    def add_booking():
        """Add a new booking to the database"""
        name = request.form.get("name")
        email = request.form.get("email")
        selected_apartment = request.form.get("selectedApartment")
        start_date_str = request.form.get("startDate")
        end_date_str = request.form.get("endDate")
        if not all([name, email, selected_apartment, start_date_str, end_date_str]):
            return jsonify({"error": "Missing required fields"}), 400
        try:
            start_date = datetime.fromisoformat(start_date_str.replace("Z", "+00:00"))
            end_date = datetime.fromisoformat(end_date_str.replace("Z", "+00:00"))
            if selected_apartment == "C":
                booking1 = Booking(
                    name=name,
                    email=email,
                    selected_apartment="A",
                    start_date=start_date,
                    end_date=end_date,
                )
                booking2 = Booking(
                    name=name,
                    email=email,
                    selected_apartment="B",
                    start_date=start_date,
                    end_date=end_date,
                )
                db.session.add(booking1)
                db.session.add(booking2)
            else:
                booking = Booking(
                    name=name,
                    email=email,
                    selected_apartment=selected_apartment,
                    start_date=start_date,
                    end_date=end_date,
                )
                db.session.add(booking)
            db.session.commit()
            return jsonify({"message": "Booking added successfully"}), 201

        except ValueError as e:
            warnings.warn("WARNING: Date parsing error", e)
            return jsonify({"error": "Invalid date format"}), 400
        except Exception as e:
            db.session.rollback()  # Rollback in case of error
            warnings.warn("WARNING: Error processing booking", e)
            return (
                jsonify({"error": "An error occurred while processing the booking"}),
                500,
            )

    @app.route("/reservations/<apartment>", methods=["GET"])
    def get_reservations(apartment):
        """Get all upcoming and ongoing reservations for a given apartment"""
        today = time.strftime("%Y-%m-%d")
        if apartment == "C":
            bookings = Booking.query.filter(Booking.end_date >= today).all()
        else:
            bookings = Booking.query.filter(
                and_(Booking.selected_apartment == apartment, Booking.end_date >= today)
            ).all()
        bookings_list = [
            {
                "start_date": booking.start_date,
                "end_date": booking.end_date,
            }
            for booking in bookings
        ]
        return jsonify(bookings_list)

    @app.route("/reservations")
    def all_reservations():
        """Returns all upcoming and ongoinog reservations"""
        logging.info("retrieving all reservations")
        today = time.strftime("%Y-%m-%d")
        bookings = Booking.query.filter(Booking.end_date >= today).all()
        return render_template("bookings.html", bookings=bookings)

    @app.route("/inactive", methods=["POST"])
    def get_inactive_bookings():
        """Get all past bookings for a user"""
        email = request.form.get("email")
        today = time.strftime("%Y-%m-%d")
        bookings = Booking.query.filter(
            and_(Booking.email == email, Booking.end_date < today)
        ).all()
        bookings_list = [
            {
                "apartment": booking.selected_apartment,
                "startDate": booking.start_date,
                "endDate": booking.end_date,
            }
            for booking in bookings
        ]
        return jsonify(bookings_list)

    @app.route("/active", methods=["POST"])
    def get_active_bookings():
        """Get all active bookings for a user"""
        email = request.form.get("email")
        today = time.strftime("%Y-%m-%d")
        bookings = Booking.query.filter(
            and_(Booking.email == email, Booking.end_date >= today)
        ).all()
        bookings_list = [
            {
                "apartment": booking.selected_apartment,
                "startDate": booking.start_date,
                "endDate": booking.end_date,
            }
            for booking in bookings
        ]
        return jsonify(bookings_list)

    @app.route("/users", methods=["GET"])
    def get_all_registered_users():
        """Returns all registered users"""
        logging.info("retrieving all users")
        users = User.query.all()
        return render_template("users.html", users=users)

    @app.route("/register", methods=["POST"])
    def register():
        """Register a new user if noto already exists"""
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")
        if not all([email, password]):
            return jsonify({"error": "Missing required fields"}), 400
        user = User.query.filter_by(email=email).first()
        if user:
            return jsonify({"error": "User already exists"}), 409
        new_user = User(name=name, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201

    @app.route("/username", methods=["POST"])
    def get_username():
        """This function simply returns the name of a user given their email"""
        email = request.form.get("email")
        user = User.query.filter_by(email=email).first()
        return jsonify({"name": user.name if user else None})

    @app.route("/login", methods=["POST"])
    def login():
        """Returns a message if login is successful or not"""
        email = request.form.get("email")
        password = request.form.get("password")
        if not all([email, password]):
            return jsonify({"error": "Missing required fields"}), 400
        user = User.query.filter_by(email=email).first()
        if user and user.password == password:
            return jsonify({"message": "Login successful"}), 200
        return jsonify({"error": "Invalid credentials"}), 401

    @app.route("/user-booking", methods=["POST"])
    def retrieve_user_bookings():
        """Get all bookings for a user"""
        email = request.form.get("email")
        if not email:
            return jsonify({"error": "Missing required fields"}), 400
        bookings = Booking.query.filter_by(email=email).all()
        bookings_list = [
            {
                "selected_apartment": booking.selected_apartment,
                "start_date": booking.start_date,
                "end_date": booking.end_date,
            }
            for booking in bookings
        ]
        return jsonify(bookings_list)  # TODO: return a template with the bookings

    def get_name_for_email(email):
        user = User.query.filter_by(email=email).first()
        return user.name if user else email

    @app.route("/user-review", methods=["POST"])
    def get_current_review():
        email = request.form.get("email")
        apartment = request.form.get("apartment")
        review = Rating.query.filter(
            and_(
                Rating.email == email,
                Rating.apartment == apartment,
            )
        ).first()
        name = get_name_for_email(email)
        return jsonify(
            {
                "name": name if name else email,
                "rating": review.rating if review else None,
                "review": review.review if review else None,
                "apartment": apartment,
            }
        )

    @app.route("/review", methods=["POST"])
    def submit_user_rating():
        """Add a rating for a user. If the user has already rated the apartment (A, B or C), the rating will be updated."""
        email = request.form.get("email")
        rating = request.form.get("rating")
        review = request.form.get("review")
        apartment = request.form.get("apartment")
        if not email or not review or not rating:
            return jsonify({"error": "Missing required fields"}), 400
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        # If the user tries to rate the same apartment again, the rating will be updated
        if not rating in ["1", "2", "3", "4", "5"]:
            return jsonify({"error": "Rating must be between 1 and 5"}), 400
        if apartment not in ["A", "B", "C"]:
            return jsonify({"error": "Invalid apartment"}), 400
        # Here we consider renting both apartments as separate
        user_rating = Rating.query.filter(
            and_(Rating.email == email, Rating.apartment == apartment)
        ).first()
        if user_rating:
            user_rating.rating = rating
            user_rating.review = review
        else:
            new_rating = Rating(
                email=email, rating=rating, review=review, apartment=apartment
            )
            db.session.add(new_rating)
        db.session.commit()
        return jsonify({"message": "Rating added successfully"}), 201

    @app.route("/reviews", methods=["GET"])
    def get_reviews():
        """Get all reviews for a given apartment"""
        reviews = Rating.query.all()
        reviews_list = [
            {
                "name": get_name_for_email(review.email),
                "rating": review.rating,
                "review": review.review,
                "apartment": review.apartment,
            }
            for review in reviews
        ]
        return jsonify(reviews_list)

    @app.route("/reviews/<apartment>", methods=["GET"])
    def get_reviews_for_apartment(apartment):
        """Get all reviews for a given apartment"""
        reviews = Rating.query.filter_by(apartment=apartment).all()
        reviews_list = [
            {
                "name": get_name_for_email(review.email),
                "rating": review.rating,
                "review": review.review,
                "apartment": review.apartment,
            }
            for review in reviews
        ]
        return jsonify(reviews_list)

    @app.route("/reset-password", methods=["POST"])
    def reset_password():
        email = request.form.get("email")
        old_password = request.form.get("oldPassword")
        new_password = request.form.get("newPassword")
        if not all([email, new_password]):
            return jsonify({"error": "Missing required fields"}), 400
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404
        if user.password != old_password:
            return jsonify({"error": "Invalid password"}), 401
        user.password = new_password
        db.session.commit()
        return jsonify({"message": "Password reset successfully"}), 200

    # ----------------- NEW ROUTES -----------------
    # TODO: Add email account
    us = "example@gmail.com"
    password = "examplePassword"

    def send_mail(recipients: list[str], subject: str, body: str):
        msg = MIMEText(body)
        msg["Subject"] = subject
        msg["From"] = us
        msg["To"] = ", ".join(recipients)
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp_server:
            smtp_server.login(us, password)
            smtp_server.sendmail(us, recipients, msg.as_string())

    @app.route("/upload", methods=["POST"])
    def upload_file():
        file = request.files["file"]
        if not file:
            return jsonify({"error": "No file provided"}), 400
        uploads_dir = os.path.join(os.getcwd(), "uploads")
        if not os.path.exists(uploads_dir):
            os.makedirs(uploads_dir)
        file.save(os.path.join(uploads_dir, file.filename))

    @app.route("/mail", methods=["POST"])
    def mail_to_user():
        target_mail = request.form.get("target_mail")
        subject = request.form.get("subject")
        body = request.form.get("body")
        if not all([target_mail, body, subject]):
            return jsonify({"error": "Missing required fields"}), 400
        send_mail([target_mail, us], subject, body)
        return jsonify({"message": "Email sent successfully"}), 200

    return app


def start_server():
    parser = argparse.ArgumentParser()

    # API flag
    parser.add_argument(
        "--host",
        default="127.0.0.1",
        help="The host to run the server",
    )
    parser.add_argument(
        "--port",
        default=8080,
        help="The port to run the server",
    )
    parser.add_argument(
        "--debug",
        action="store_true",
        help="Run Flask in debug mode",
    )

    args = parser.parse_args()

    server_app = create_app()

    server_app.run(debug=args.debug, host=args.host, port=args.port)


if __name__ == "__main__":
    start_server()

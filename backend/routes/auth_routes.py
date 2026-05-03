from flask import Blueprint, request, jsonify
from extensions import db
from models.user import User
from flask_jwt_extended import create_access_token

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "User already exists"}), 400

    user = User(
        name=data["name"],
        email=data["email"],
        role=data.get("role", "student")
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Registered"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data.get("email")).first()

    if not user or not user.check_password(data.get("password")):
        return jsonify({"message": "Invalid credentials"}), 401

    # ✅ THIS IS THE IMPORTANT PART
    token = create_access_token(
        identity=str(user.id),                 # MUST be string
        additional_claims={"role": user.role}  # role stored separately
    )

    return jsonify({"access_token": token}), 200

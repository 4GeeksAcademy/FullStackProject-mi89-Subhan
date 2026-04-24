import os
import requests
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from itsdangerous import URLSafeTimedSerializer
from models import db, User, MoodEntry, JournalEntry
from utils import hash_password, verify_password

api = Blueprint("api", __name__)

serializer = URLSafeTimedSerializer(
    os.getenv("JWT_SECRET_KEY", "super-secret-key")
)

# -----------------------
# AUTH ROUTES
# -----------------------

@api.route("/signup", methods=["POST"])
def signup():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"msg": "User already exists"}), 400

    new_user = User(
        email=email,
        password=hash_password(password)
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201


@api.route("/login", methods=["POST"])
def login():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not verify_password(user.password, password):
        return jsonify({"msg": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": token,
        "user": user.serialize()
    }), 200


# -----------------------
# PASSWORD RESET
# -----------------------

@api.route("/forgot-password", methods=["POST"])
def forgot_password():
    body = request.get_json()
    email = body.get("email")

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({
            "msg": "If that email exists, a reset link has been generated."
        }), 200

    token = serializer.dumps(email, salt="password-reset-salt")

    reset_link = f"http://localhost:5173/reset-password/{token}"

    return jsonify({
        "msg": "Password reset link generated",
        "reset_link": reset_link
    }), 200


@api.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):
    body = request.get_json()
    new_password = body.get("password")

    if not new_password:
        return jsonify({"msg": "Password is required"}), 400

    try:
        email = serializer.loads(
            token,
            salt="password-reset-salt",
            max_age=3600
        )
    except Exception:
        return jsonify({"msg": "Invalid or expired token"}), 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"msg": "User not found"}), 404

    user.password = hash_password(new_password)
    db.session.commit()

    return jsonify({"msg": "Password updated successfully"}), 200


# -----------------------
# MOODS
# -----------------------

@api.route("/moods", methods=["GET"])
@jwt_required()
def get_moods():
    user_id = int(get_jwt_identity())

    moods = MoodEntry.query.filter_by(user_id=user_id).order_by(
        MoodEntry.created_at.desc()
    ).all()

    return jsonify([m.serialize() for m in moods]), 200


@api.route("/moods", methods=["POST"])
@jwt_required()
def create_mood():
    user_id = int(get_jwt_identity())

    body = request.get_json()
    mood = body.get("mood")
    note = body.get("note")

    if not mood:
        return jsonify({"msg": "Mood is required"}), 400

    new_mood = MoodEntry(
        mood=mood,
        note=note,
        user_id=user_id
    )

    db.session.add(new_mood)
    db.session.commit()

    return jsonify(new_mood.serialize()), 201


# -----------------------
# JOURNAL (FULL CRUD)
# -----------------------

@api.route("/journal", methods=["GET"])
@jwt_required()
def get_journal_entries():
    user_id = int(get_jwt_identity())

    entries = JournalEntry.query.filter_by(user_id=user_id).order_by(
        JournalEntry.created_at.desc()
    ).all()

    return jsonify([e.serialize() for e in entries]), 200


@api.route("/journal", methods=["POST"])
@jwt_required()
def create_journal_entry():
    user_id = int(get_jwt_identity())

    body = request.get_json()
    title = body.get("title")
    content = body.get("content")

    if not title or not content:
        return jsonify({"msg": "Title and content are required"}), 400

    new_entry = JournalEntry(
        title=title,
        content=content,
        user_id=user_id
    )

    db.session.add(new_entry)
    db.session.commit()

    return jsonify(new_entry.serialize()), 201


@api.route("/journal/<int:entry_id>", methods=["PUT"])
@jwt_required()
def update_journal_entry(entry_id):
    user_id = int(get_jwt_identity())

    entry = JournalEntry.query.filter_by(
        id=entry_id,
        user_id=user_id
    ).first()

    if not entry:
        return jsonify({"msg": "Entry not found"}), 404

    body = request.get_json()

    entry.title = body.get("title", entry.title)
    entry.content = body.get("content", entry.content)

    db.session.commit()

    return jsonify(entry.serialize()), 200


@api.route("/journal/<int:entry_id>", methods=["DELETE"])
@jwt_required()
def delete_journal_entry(entry_id):
    user_id = int(get_jwt_identity())

    entry = JournalEntry.query.filter_by(
        id=entry_id,
        user_id=user_id
    ).first()

    if not entry:
        return jsonify({"msg": "Entry not found"}), 404

    db.session.delete(entry)
    db.session.commit()

    return jsonify({"msg": "Entry deleted"}), 200

@api.route("/resources/search", methods=["GET"])
def search_resources():
    city = request.args.get("city")

    if not city:
        return jsonify({"msg": "City is required"}), 400

    try:
        city_name = city.split(",")[0].strip()

        geo_url = "https://geocoding-api.open-meteo.com/v1/search"
        geo_params = {
            "name": city_name,
            "count": 1,
            "language": "en",
            "format": "json"
        }

        geo_response = requests.get(geo_url, params=geo_params, timeout=15)
        geo_data = geo_response.json()

        if "results" not in geo_data or len(geo_data["results"]) == 0:
            return jsonify({"msg": "Location not found"}), 404

        lat = geo_data["results"][0]["latitude"]
        lon = geo_data["results"][0]["longitude"]

        overpass_url = "https://overpass-api.de/api/interpreter"

        query = f"""
        [out:json][timeout:25];
        (
          node["amenity"="clinic"](around:15000,{lat},{lon});
          node["amenity"="hospital"](around:15000,{lat},{lon});
          node["healthcare"="psychotherapist"](around:15000,{lat},{lon});
          node["healthcare"="counselling"](around:15000,{lat},{lon});
          way["amenity"="clinic"](around:15000,{lat},{lon});
          way["amenity"="hospital"](around:15000,{lat},{lon});
        );
        out center tags;
        """

        overpass_response = requests.post(
            overpass_url,
            data={"data": query},
            timeout=30,
            headers={"User-Agent": "MindTrackStudentProject/1.0"}
        )

        if overpass_response.status_code != 200:
            return jsonify({"msg": "Resource search failed"}), 500

        overpass_data = overpass_response.json()

        resources = []

        for item in overpass_data.get("elements", []):
            tags = item.get("tags", {})

            if not tags.get("name"):
                continue

            resources.append({
                "id": item.get("id"),
                "name": tags.get("name"),
                "type": tags.get("healthcare") or tags.get("amenity") or "health resource",
                "address": tags.get("addr:full") or tags.get("addr:street") or "Address not listed"
            })

        return jsonify(resources[:10]), 200

    except Exception as error:
        print(error)
        return jsonify({"msg": "Something went wrong while searching resources"}), 500
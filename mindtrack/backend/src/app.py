import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from models import db
from routes import api

app = Flask(__name__)

# ✅ Handle DATABASE_URL correctly (Heroku uses postgres://, Flask needs postgresql://)
database_url = os.getenv("DATABASE_URL", "sqlite:///mindtrack.db")

if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")

# ✅ CORS (allow frontend access)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

# ✅ Init extensions
db.init_app(app)
Migrate(app, db)
JWTManager(app)

# ✅ Register routes
app.register_blueprint(api, url_prefix="/api")

# ✅ Fix CORS headers
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response

# ✅ Create tables (needed for first deploy)
with app.app_context():
    db.create_all()

# ✅ Optional root route (prevents 404 on homepage)
@app.route("/")
def home():
    return {"msg": "MindTrack API is running"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
import os
from flask import Flask, request, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager

from .config import Config
from .models import db, User
from .models.videos import Video
from .models.comment import Comment
from .models.playlist import Playlist
from .models.filter import Filter
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.video_routes import video_routes
from .api.comment_routes import comment_routes
from .api.playlist_routes import playlist_routes
from .seeds import seed_commands

app = Flask(
    __name__,
    static_folder='../react-vite/dist',
    static_url_path='/'
)

# Load config
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
Migrate(app, db)
CORS(app, supports_credentials=True)
# CSRFProtect(app)  # Temporarily disabled for debugging

# Login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'
@login.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Seed CLI commands
app.cli.add_command(seed_commands)

# Register blueprints
app.register_blueprint(user_routes,      url_prefix='/api/users')
app.register_blueprint(auth_routes,      url_prefix='/api/auth')
app.register_blueprint(video_routes,     url_prefix='/api/videos')
app.register_blueprint(comment_routes,   url_prefix='/api/comments')
app.register_blueprint(playlist_routes,  url_prefix='/api/playlists')

# Force HTTPS in production
@app.before_request
def https_redirect():
    if os.getenv('FLASK_ENV') == 'production' and \
       request.headers.get('X-Forwarded-Proto') == 'http':
        return redirect(request.url.replace('http://', 'https://', 1), code=301)

# Inject CSRF token cookie
@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=(os.getenv('FLASK_ENV')=='production'),
        samesite='Strict' if os.getenv('FLASK_ENV')=='production' else None,
        httponly=True
    )
    # Add XSRF-TOKEN cookie for frontend
    response.set_cookie(
        'XSRF-TOKEN',
        generate_csrf(),
        secure=(os.getenv('FLASK_ENV')=='production'),
        samesite='Strict' if os.getenv('FLASK_ENV')=='production' else None,
        httponly=False  # Needs to be accessible from JavaScript
    )
    return response

# API documentation endpoint
@app.route("/api/docs")
def api_docs():
    """
    Returns all API routes and their doc strings
    """
    acceptable = ['GET','POST','PUT','PATCH','DELETE']
    docs = {
        rule.rule: [
            [m for m in rule.methods if m in acceptable],
            app.view_functions[rule.endpoint].__doc__
        ]
        for rule in app.url_map.iter_rules() if rule.endpoint != 'static'
    }
    return docs

# React SPA fallback
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

def create_app():
    """Factory for Flask-Migrate & Flask CLI support."""
    return app

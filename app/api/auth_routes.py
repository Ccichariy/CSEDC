from flask import Blueprint, request
from app.models import User, db
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required

auth_routes = Blueprint('auth', __name__)


@auth_routes.route('/')
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {'errors': {'message': 'Unauthorized'}}, 401


@auth_routes.route('/login', methods=['POST'])
def login():
    """
    Logs a user in
    """
    data = request.get_json()
    # Check if credential is provided (from frontend)
    if 'credential' in data:
        # Handle credential (could be username or email)
        credential = data['credential']
        password = data['password']
        
        # Try to find user by email or username
        user = User.query.filter((User.email == credential) | (User.username == credential)).first()
        
        if user and user.check_password(password):
            login_user(user)
            return user.to_dict()
        return {'errors': {'credential': 'Invalid credentials'}}, 401
    else:
        # Original form validation flow
        try:
            form = LoginForm()
            form['csrf_token'].data = request.cookies.get('csrf_token', '')
            if form.validate_on_submit():
                user = User.query.filter(User.email == form.data['email']).first()
                login_user(user)
                return user.to_dict()
            return form.errors, 401
        except Exception as e:
            return {'errors': {'server': str(e)}}, 400


@auth_routes.route('/logout')
def logout():
    """
    Logs a user out
    """
    logout_user()
    return {'message': 'User logged out'}


@auth_routes.route('/signup', methods=['POST'])
def sign_up():
    """
    Creates a new user and logs them in
    """
    data = request.get_json()
    
    # Direct JSON handling for frontend requests
    if data and 'username' in data and 'email' in data and 'password' in data:
        # Check if email exists
        existing_email = User.query.filter(User.email == data['email']).first()
        if existing_email:
            return {'errors': {'email': 'Email address is already in use.'}}, 401
            
        # Check if username exists
        existing_username = User.query.filter(User.username == data['username']).first()
        if existing_username:
            return {'errors': {'username': 'Username is already in use.'}}, 401
            
        # Create new user
        try:
            user = User(
                username=data['username'],
                email=data['email'],
                password=data['password']
            )
            db.session.add(user)
            db.session.commit()
            login_user(user)
            return user.to_dict()
        except Exception as e:
            db.session.rollback()
            return {'errors': {'server': str(e)}}, 400
    else:
        # Original form validation flow
        try:
            form = SignUpForm()
            form['csrf_token'].data = request.cookies.get('csrf_token', '')
            if form.validate_on_submit():
                user = User(
                    username=form.data['username'],
                    email=form.data['email'],
                    password=form.data['password']
                )
                db.session.add(user)
                db.session.commit()
                login_user(user)
                return user.to_dict()
            return form.errors, 401
        except Exception as e:
            return {'errors': {'server': str(e)}}, 400


@auth_routes.route('/unauthorized')
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {'errors': {'message': 'Unauthorized'}}, 401
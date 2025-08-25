import os

class Config:
    # Secret key for sessions & WTForms
    SECRET_KEY = os.environ.get('SECRET_KEY', 'super-secret-key')

    # Port for flask run (optional)
    FLASK_RUN_PORT = os.environ.get('FLASK_RUN_PORT', 5000)

    # Disable the event system to save overhead
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Use DATABASE_URL from env (Render/Heroku), otherwise fall back to SQLite for local dev.
    # Also fix the postgres:// → postgresql:// prefix only once.
    database_url = os.environ.get('DATABASE_URL')
    if database_url:
        SQLALCHEMY_DATABASE_URI = database_url.replace('postgres://', 'postgresql://', 1)
    else:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'

    # Echo SQL to console (helpful in dev)
    SQLALCHEMY_ECHO = True

# import os


# class Config:
#     SECRET_KEY = os.environ.get('SECRET_KEY')
#     FLASK_RUN_PORT = os.environ.get('FLASK_RUN_PORT')
#     SQLALCHEMY_TRACK_MODIFICATIONS = False
#     # SQLAlchemy 1.4 no longer supports url strings that start with 'postgres'
#     # (only 'postgresql') but heroku's postgres add-on automatically sets the
#     # url in the hidden config vars to start with postgres.
#     # so the connection uri must be updated here (for production)
#     SQLALCHEMY_DATABASE_URI = os.environ.get(
#         'DATABASE_URL').replace('postgres://', 'postgresql://')
#     SQLALCHEMY_ECHO = True

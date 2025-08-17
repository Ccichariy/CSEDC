from app.models import db, Playlist, environment, SCHEMA
from sqlalchemy.sql import text

def seed_playlists():
    p1 = Playlist(
        user_id=1,
        name="Grade 6: Fraction Division",
        description="Collection of videos on dividing fractions (Grade 6)."
    )
    p2 = Playlist(
        user_id=1,
        name="Grade 7: Expressions & Equations",
        description="Videos on solving and simplifying expressions (Grade 7)."
    )
    p3 = Playlist(
        user_id=1,
        name="Grade 7: Khan Academy Practice",
        description="Supplemental Khan Academy playlist on equations and inequalities."
    )
    db.session.add_all([p1, p2, p3])
    db.session.commit()

def undo_playlists():
    if environment == 'production':
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.playlists RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM playlists"))
    db.session.commit()
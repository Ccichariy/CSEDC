from app.models import db, Playlist, Video, environment, SCHEMA
from sqlalchemy.sql import text

def seed_playlist_videos():
    p1 = Playlist.query.get(1)
    p2 = Playlist.query.get(2)
    v1 = Video.query.get(1)
    v2 = Video.query.get(2)
    p1.videos.append(v1)
    p1.videos.append(v2)
    p2.videos.append(v1)
    db.session.commit()

def undo_playlist_videos():
    if environment == 'production':
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.playlist_videos RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM playlist_videos"))
    db.session.commit()
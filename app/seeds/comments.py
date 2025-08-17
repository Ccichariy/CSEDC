from app.models import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text

def seed_comments():
    comments = [
        Comment(video_id=1, user_id=1, content="Great explanation! I finally understand dividing fractions."),
        Comment(video_id=1, user_id=2, content="Thanks—this was super clear."),
        Comment(video_id=2, user_id=1, content="Can someone walk me through step 3 again?"),
        Comment(video_id=3, user_id=2, content="Love the five-step breakdown!"),
        Comment(video_id=4, user_id=1, content="This two-step equation example really helped."),
        Comment(video_id=5, user_id=2, content="The playlist is perfect for extra practice."),
        Comment(video_id=6, user_id=1, content="Nice intro to variables and expressions."),
        Comment(video_id=7, user_id=2, content="Khan Academy always nails it—thanks for sharing!"),
    ]
    db.session.add_all(comments)
    db.session.commit()

def undo_comments():
    if environment == 'production':
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM comments"))
    db.session.commit()
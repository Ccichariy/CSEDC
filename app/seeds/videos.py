from app.models import db, Video, environment, SCHEMA
from sqlalchemy.sql import text

def seed_videos():
    videos = [
        Video(
            owner_id=1,
            title="How to Divide Fractions – 6th Grade Math",
            description="Clear walk-through of the invert-and-multiply method for dividing fractions.",
            url="https://www.youtube.com/watch?v=uZsgrIbjus4",
            thumbnail_url=""
        ),
        Video(
            owner_id=1,
            title="Division of fractions: concept and applications, part 1",
            description="Deep dive into application-based fractions division.",
            url="https://www.youtube.com/watch?v=I8b0uxXM11Y",
            thumbnail_url=""
        ),
        Video(
            owner_id=1,
            title="5 Steps to DIVIDE Fractions | Grade 6 Math 6",
            description="Step-by-step guide to dividing fractions in five easy steps.",
            url="https://www.youtube.com/watch?v=RBW0-IW8fe0",
            thumbnail_url=""
        ),
        Video(
            owner_id=2,
            title="Solving Two-Step Equations | Grade 7",
            description="Foundational two-step equation strategies for Grade 7.",
            url="https://www.youtube.com/watch?v=q3g68vcMXxM",
            thumbnail_url=""
        ),
        Video(
            owner_id=2,
            title="7.EE.A.1 | Expressions & Equations | Grade 7 Math",
            description="Playlist covering the Expressions & Equations standard.",
            url="https://www.youtube.com/playlist?list=PLIa7w81Zp_7xwc9qNuWE9yZSKiBm4FiC8",
            thumbnail_url=""
        ),
        Video(
            owner_id=2,
            title="Variables, Expressions, and Equations | Math with Mr. J",
            description="Intro to variables and building algebraic expressions.",
            url="https://www.youtube.com/watch?v=Qa-MCLDrSlI",
            thumbnail_url=""
        ),
        Video(
            owner_id=2,
            title="Khan Academy – Expressions, equations, and inequalities",
            description="Comprehensive Khan Academy playlist on expressions and inequalities.",
            url="https://www.youtube.com/playlist?list=PLSQl0a2vh4HD5_VHZK5wJ_WqIGMq6nsG2",
            thumbnail_url=""
        )
    ]
    db.session.add_all(videos)
    db.session.commit()

def undo_videos():
    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.videos RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM videos"))
    db.session.commit()
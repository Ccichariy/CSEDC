from app.models import db, Filter, environment, SCHEMA
from sqlalchemy.sql import text

def seed_filters():
    filters = [
        Filter(id=1, name="Ratios and Proportional Relationships"),
        Filter(id=2, name="The Number System"),
        Filter(id=3, name="Expressions and Equations"),
        Filter(id=4, name="Geometry"),
        Filter(id=5, name="Statistics and Probability")
    ]
    db.session.add_all(filters)
    db.session.commit()

def undo_filters():
    if environment == 'production':
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.filters RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM filters"))
    db.session.commit()
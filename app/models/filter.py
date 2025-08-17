from .db import db, environment, SCHEMA, add_prefix_for_prod

class Filter(db.Model):
    __tablename__ = 'filters'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id   = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)

    videos = db.relationship(
        "Video",
        back_populates="filters"
    )

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'videoIds': [v.id for v in self.videos]
        }
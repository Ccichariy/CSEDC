from .db import db, environment, SCHEMA, add_prefix_for_prod

class Filter(db.Model):
    __tablename__ = 'filters'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)

    # Remove the direct relationship that references Video.filter_id:
    # videos = db.relationship(
    #     "Video",
    #     back_populates="filter",
    #     foreign_keys="Video.filter_id"
    # )
    
    # Keep only the many-to-many relationship through video_filters table
    videos = db.relationship(
        "Video",
        secondary="video_filters",
        back_populates="filters"
    )

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'videoIds': [v.id for v in self.videos],
        }
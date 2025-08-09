from .db import db, environment, SCHEMA, add_prefix_for_prod

video_filters = db.Table(
    'video_filters',
    db.Column(
        'video_id',
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('videos.id')),
        primary_key=True
    ),
    db.Column(
        'filter_id',
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('filters.id')),
        primary_key=True
    ),
    schema=SCHEMA if environment == "production" else None
)

class Filter(db.Model):
    __tablename__ = 'filters'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)

    # Relationships
    videos = db.relationship(
        "Video",
        secondary=video_filters,
        back_populates="filters"
    )

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name
        }
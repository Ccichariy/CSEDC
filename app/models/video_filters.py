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
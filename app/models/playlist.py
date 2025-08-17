from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone

playlist_videos = db.Table(
    'playlist_videos',
    db.Column(
        'playlist_id',
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('playlists.id')),
        primary_key=True
    ),
    db.Column(
        'video_id',
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('videos.id')),
        primary_key=True
    ),
    schema=SCHEMA if environment == "production" else None
)

class Playlist(db.Model):
    __tablename__ = 'playlists'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod('users.id')),
        nullable=False
    )
    name        = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at  = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at  = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    user   = db.relationship("User", back_populates="playlists")
    videos = db.relationship(
        "Video",
        secondary=playlist_videos,
        back_populates="playlists"
    )

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'name': self.name,
            'description': self.description,
            'videoIds': [v.id for v in self.videos],
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }

# from .db import db, environment, SCHEMA, add_prefix_for_prod
# from datetime import datetime, timezone


# playlist_videos = db.Table(
#     'playlist_videos',
#     db.Column(
#         'playlist_id',
#         db.Integer,
#         db.ForeignKey(add_prefix_for_prod('playlists.id')),
#         primary_key=True
#     ),
#     db.Column(
#         'video_id',
#         db.Integer,
#         db.ForeignKey(add_prefix_for_prod('videos.id')),
#         primary_key=True
#     ),
#     schema=SCHEMA if environment == "production" else None
# )

# class Playlist(db.Model):
#     __tablename__ = 'playlists'

#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}

#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(
#         db.Integer,
#         db.ForeignKey(add_prefix_for_prod('users.id')),
#         nullable=False
#     )
#     playlist_videos = db.Table(
#     'playlist_videos',
#     db.Column(
#         'playlist_id',
#         db.Integer,
#         db.ForeignKey(add_prefix_for_prod('playlists.id')),
#         primary_key=True
#     ),
#     db.Column(
#         'video_id',
#         db.Integer,
#         db.ForeignKey(add_prefix_for_prod('videos.id')),
#         primary_key=True
#     ),
#     schema=SCHEMA if environment == "production" else None

#     name = db.Column(db.String(255), nullable=False)
#     description = db.Column(db.Text, nullable=True)
#     created_at = db.Column(
#         db.DateTime(timezone=True),
#         default=lambda: datetime.now(timezone.utc),
#         nullable=False
#     )
#     updated_at = db.Column(
#         db.DateTime(timezone=True),
#         default=lambda: datetime.now(timezone.utc),
#         onupdate=lambda: datetime.now(timezone.utc),
#         nullable=False
#     )

#     # Relationships
#     user = db.relationship("User", back_populates="playlists")
#     videos = db.relationship(
#         "Video",
#         secondary=playlist_videos,
#         back_populates="playlists"
#     )
#     playlists = db.relationship(
#     "Playlist",
#     secondary=playlist_videos,
#     back_populates="videos"
#     )   

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'userId': self.user_id,
#             'name': self.name,
#             'description': self.description,
#             'videoIds': [v.id for v in self.videos],
#             'createdAt': self.created_at.isoformat() if self.created_at else None,
#             'updatedAt': self.updated_at.isoformat() if self.updated_at else None
#         }
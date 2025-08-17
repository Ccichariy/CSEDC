from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime, timezone
from .playlist import playlist_videos

class Video(db.Model):
    __tablename__ = 'videos'
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("users.id")),
        nullable=False
    )
    filter_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("filters.id")),
        nullable=True
    )
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    url = db.Column(db.String(500), nullable=False)
    thumbnail_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    # Relationships
    owner = db.relationship("User", back_populates="videos")
    comments = db.relationship(
        "Comment",
        back_populates="video",
        cascade="all, delete-orphan"
    )
    playlists = db.relationship(
        "Playlist",
        secondary=playlist_videos,
        back_populates="videos"
    )
    filters = db.relationship(
        "Filter",
        back_populates="videos"
    )

    def to_dict(self):
        return {
            'id': self.id,
            'ownerId': self.owner_id,
            'title': self.title,
            'description': self.description,
            'url': self.url,
            'thumbnailUrl': self.thumbnail_url,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
            'playlistIds': [p.id for p in self.playlists],
            'filterIds':   [f.id for f in self.filters]
        }

# from .db import db, environment, SCHEMA, add_prefix_for_prod
# from datetime import datetime, timezone
# from .playlist import playlist_videos
# from .filter import video_filters  

# class Video(db.Model):
#     __tablename__ = 'videos'

#     if environment == "production":
#         __table_args__ = {'schema': SCHEMA}

#     id = db.Column(db.Integer, primary_key=True)
#     owner_id = db.Column(
#         db.Integer,
#         db.ForeignKey(add_prefix_for_prod("users.id")),
#         nullable=False
#     )
#     title = db.Column(db.String(255), nullable=False)
#     description = db.Column(db.Text, nullable=True)
#     url = db.Column(db.String(500), nullable=False)
#     thumbnail_url = db.Column(db.String(500), nullable=True)
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
#     owner = db.relationship("User", back_populates="videos")
#     comments = db.relationship(
#         "Comment",
#         back_populates="video",
#         cascade="all, delete-orphan"
#     )
#     playlists = db.relationship(
#         "Playlist",
#         secondary=playlist_videos,
#         back_populates="videos"
#     )
#     filters = db.relationship(
#         "Filter",
#         back_populates="video",
#         cascade="all, delete-orphan"
#     )

#     def to_dict(self):
#         return {
#             'id': self.id,
#             'ownerId': self.owner_id,
#             'title': self.title,
#             'description': self.description,
#             'url': self.url,
#             'thumbnailUrl': self.thumbnail_url,
#             'createdAt': self.created_at.isoformat() if self.created_at else None,
#             'updatedAt': self.updated_at.isoformat() if self.updated_at else None,
#             'filters': [f.to_dict() for f in self.filters]
#         }
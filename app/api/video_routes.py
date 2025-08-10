from flask import Blueprint, request, jsonify
from app.models.video import Video
from app.models.db import db

video_routes = Blueprint('video_routes', __name__)

@video_routes.route('', methods=['GET'])
def list_videos():
    """Get all videos"""
    videos = Video.query.all()
    return jsonify([v.to_dict() for v in videos])

@video_routes.route('', methods=['POST'])
def create_video():
    """Create a new video"""
    data = request.get_json()
    video = Video(
        owner_id    = data['ownerId'],
        title       = data['title'],
        description = data.get('description'),
        url         = data['url'],
        thumbnail_url = data.get('thumbnailUrl')
    )
    db.session.add(video)
    db.session.commit()
    return jsonify(video.to_dict()), 201

# add PUT/PATCH/DELETE routes as needed…
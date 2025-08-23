from flask import Blueprint, request, jsonify
from app.models.videos import Video
from app.models.comment import Comment
from app.models.db import db

video_routes = Blueprint('video_routes', __name__)

@video_routes.route('', methods=['GET'])
def list_videos():
    """Get all videos"""
    videos = Video.query.all()
    return jsonify([v.to_dict() for v in videos])

@video_routes.route('/with-comments', methods=['GET'])
def list_videos_with_comments():
    """Get all videos with their comments"""
    videos = Video.query.all()
    return jsonify([v.to_dict_with_comments() for v in videos])

@video_routes.route('/featured', methods=['GET'])
def get_featured_videos():
    """Get the 4 latest featured videos with comments for homepage"""
    videos = Video.query.order_by(Video.created_at.desc()).limit(4).all()
    return jsonify([v.to_dict_with_comments() for v in videos])

@video_routes.route('/search', methods=['GET'])
def search_videos():
    """Search videos by title or description"""
    query = request.args.get('q', '')
    filter_id = request.args.get('filter_id')
    
    # Start with base query
    video_query = Video.query
    
    # Apply text search if query provided
    if query:
        video_query = video_query.filter(
            db.or_(
                Video.title.ilike(f'%{query}%'),
                Video.description.ilike(f'%{query}%')
            )
        )
    
    # Apply filter if provided
    if filter_id:
        video_query = video_query.filter(Video.filter_id == filter_id)
    
    videos = video_query.all()
    return jsonify([video.to_dict_with_comments() for video in videos])

@video_routes.route('/filters', methods=['GET'])
def get_filters():
    """Get all available filters/categories"""
    from app.models.filter import Filter
    filters = Filter.query.all()
    return jsonify([filter.to_dict() for filter in filters])

@video_routes.route('/<int:video_id>', methods=['GET'])
def get_video(video_id):
    """Get a single video with comments"""
    video = Video.query.get_or_404(video_id)
    return jsonify(video.to_dict_with_comments())

@video_routes.route('/<int:video_id>/comments', methods=['GET'])
def get_video_comments(video_id):
    """Get all comments for a video"""
    video = Video.query.get_or_404(video_id)
    comments = Comment.query.filter_by(video_id=video_id).all()
    return jsonify([c.to_dict() for c in comments])

@video_routes.route('/<int:video_id>/comments', methods=['POST'])
def create_comment(video_id):
    """Create a comment for a video"""
    video = Video.query.get_or_404(video_id)
    data = request.get_json()
    comment = Comment(
        user_id=data['userId'],
        video_id=video_id,
        content=data['content']
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify(comment.to_dict()), 201

@video_routes.route('/<int:video_id>/comments/<int:comment_id>', methods=['PUT'])
def update_comment(video_id, comment_id):
    """Update a comment for a video"""
    video = Video.query.get_or_404(video_id)
    comment = Comment.query.get_or_404(comment_id)
    data = request.get_json()
    
    comment.content = data['content']
    db.session.commit()
    return jsonify(comment.to_dict())

@video_routes.route('/<int:video_id>/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(video_id, comment_id):
    """Delete a comment for a video"""
    video = Video.query.get_or_404(video_id)
    comment = Comment.query.get_or_404(comment_id)
    
    db.session.delete(comment)
    db.session.commit()
    return jsonify({'message': 'Comment deleted successfully'}), 200

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
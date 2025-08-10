from flask import Blueprint, request, jsonify
from app.models.comment import Comment
from app.models.db import db

comment_routes = Blueprint('comment_routes', __name__)

@comment_routes.route('', methods=['GET'])
def get_comments():
    """Get all comments"""
    comments = Comment.query.all()
    return jsonify([c.to_dict() for c in comments])

@comment_routes.route('', methods=['POST'])
def create_comment():
    """Create a comment"""
    data = request.get_json()
    comment = Comment(
        user_id  = data['userId'],
        video_id = data['videoId'],
        content  = data['content']
    )
    db.session.add(comment)
    db.session.commit()
    return jsonify(comment.to_dict()), 201

# add UPDATE/DELETE routes as needed…
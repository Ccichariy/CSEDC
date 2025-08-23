from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models.playlist import Playlist
from app.models.videos import Video  # Fixed import - changed from 'video' to 'videos'
from app.models.db import db

playlist_routes = Blueprint('playlist_routes', __name__)

@playlist_routes.route('', methods=['GET'])
def get_playlists():
    """Get all playlists"""
    playlists = Playlist.query.all()
    return jsonify([p.to_dict() for p in playlists])

@playlist_routes.route('/with-videos', methods=['GET'])
def get_playlists_with_videos():
    """Get all playlists with their videos for homepage display"""
    playlists = Playlist.query.all()
    return jsonify([p.to_dict_with_videos() for p in playlists])

@playlist_routes.route('', methods=['POST'])
def create_playlist():
    """Create a new playlist"""
    data = request.get_json()
    playlist = Playlist(
        user_id    = data['userId'],
        name       = data['name'],
        description= data.get('description')
    )
    db.session.add(playlist)
    db.session.commit()
    return jsonify(playlist.to_dict()), 201

@playlist_routes.route('/<int:playlist_id>', methods=['GET'])
def get_playlist(playlist_id):
    """Get a single playlist with videos"""
    playlist = Playlist.query.get_or_404(playlist_id)
    return jsonify(playlist.to_dict_with_videos())

@playlist_routes.route('/<int:playlist_id>', methods=['PUT'])
def update_playlist(playlist_id):
    """Update a playlist"""
    playlist = Playlist.query.get_or_404(playlist_id)
    data = request.get_json()
    
    playlist.name = data.get('name', playlist.name)
    playlist.description = data.get('description', playlist.description)
    
    db.session.commit()
    return jsonify(playlist.to_dict())

@playlist_routes.route('/<int:playlist_id>', methods=['DELETE'])
def delete_playlist(playlist_id):
    """Delete a playlist"""
    playlist = Playlist.query.get_or_404(playlist_id)
    
    db.session.delete(playlist)
    db.session.commit()
    return jsonify({'message': 'Playlist deleted successfully'}), 200

@playlist_routes.route('/<int:playlist_id>/videos/<int:video_id>', methods=['POST'])
def add_video_to_playlist(playlist_id, video_id):
    """Add a video to a playlist"""
    # Remove the local import since we now import at the top
    playlist = Playlist.query.get_or_404(playlist_id)
    video = Video.query.get_or_404(video_id)
    
    # Check if video is already in playlist
    if video in playlist.videos:
        return jsonify({'message': 'Video already in playlist'}), 400
    
    playlist.videos.append(video)
    db.session.commit()
    
    return jsonify(playlist.to_dict_with_videos()), 200

@playlist_routes.route('/<int:playlist_id>/videos/<int:video_id>', methods=['DELETE'])
def remove_video_from_playlist(playlist_id, video_id):
    """Remove a video from a playlist"""
    # Remove the local import since we now import at the top
    playlist = Playlist.query.get_or_404(playlist_id)
    video = Video.query.get_or_404(video_id)
    
    # Check if video is in playlist
    if video not in playlist.videos:
        return jsonify({'message': 'Video not in playlist'}), 400
    
    playlist.videos.remove(video)
    db.session.commit()
    
    return jsonify(playlist.to_dict_with_videos()), 200
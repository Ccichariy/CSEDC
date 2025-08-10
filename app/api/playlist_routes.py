from flask import Blueprint, request, jsonify
from app.models.playlist import Playlist
from app.models.db import db

playlist_routes = Blueprint('playlist_routes', __name__)

@playlist_routes.route('', methods=['GET'])
def get_playlists():
    """Get all playlists"""
    playlists = Playlist.query.all()
    return jsonify([p.to_dict() for p in playlists])

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

# add PUT/PATCH/DELETE routes here as needed…
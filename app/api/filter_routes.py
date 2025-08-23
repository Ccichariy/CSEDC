from flask import Blueprint, request, jsonify
from app.models.filter import Filter
from app.models.db import db

filter_routes = Blueprint('filter_routes', __name__)

@filter_routes.route('', methods=['GET'])
def get_filters():
    """Get all filters"""
    filters = Filter.query.all()
    return jsonify([f.to_dict() for f in filters])

@filter_routes.route('/<int:filter_id>', methods=['GET'])
def get_filter(filter_id):
    """Get a single filter"""
    filter = Filter.query.get_or_404(filter_id)
    return jsonify(filter.to_dict())

@filter_routes.route('', methods=['POST'])
def create_filter():
    """Create a new filter"""
    data = request.get_json()
    filter = Filter(
        name = data['name']
    )
    db.session.add(filter)
    db.session.commit()
    return jsonify(filter.to_dict()), 201

@filter_routes.route('/<int:filter_id>', methods=['PUT'])
def update_filter(filter_id):
    """Update a filter"""
    filter = Filter.query.get_or_404(filter_id)
    data = request.get_json()
    
    filter.name = data.get('name', filter.name)
    
    db.session.commit()
    return jsonify(filter.to_dict())

@filter_routes.route('/<int:filter_id>', methods=['DELETE'])
def delete_filter(filter_id):
    """Delete a filter"""
    filter = Filter.query.get_or_404(filter_id)
    
    db.session.delete(filter)
    db.session.commit()
    return jsonify({'message': 'Filter deleted successfully'}), 200
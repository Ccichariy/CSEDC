#!/usr/bin/env python3
"""
Test script to verify schema configuration is working correctly.
Run this script to check if the schema case mismatch issue is resolved.
"""

import os
from app.models import db, User, SCHEMA
from app import create_app

def test_schema_config():
    print("Testing schema configuration...")
    print(f"Environment: {os.getenv('FLASK_ENV')}")
    print(f"Raw SCHEMA from env: {os.environ.get('SCHEMA')}")
    print(f"Processed SCHEMA: {SCHEMA}")
    
    # Test if we can create a simple query
    app = create_app()
    with app.app_context():
        try:
            # This should work if schema is configured correctly
            user_count = User.query.count()
            print(f"✅ Successfully queried users table. Count: {user_count}")
            print("✅ Schema configuration appears to be working correctly!")
        except Exception as e:
            print(f"❌ Error querying users table: {e}")
            print("❌ Schema configuration may still have issues.")

if __name__ == "__main__":
    test_schema_config()
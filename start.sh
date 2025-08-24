#!/bin/bash

# Startup script for Render deployment
# This ensures database operations happen at runtime when the database is available

echo "Starting application..."

# Run database migrations
echo "Running database migrations..."
flask db upgrade

if [ $? -ne 0 ]; then
    echo "Database migration failed!"
    exit 1
fi

# Seed the database
echo "Seeding database..."
flask seed all

if [ $? -ne 0 ]; then
    echo "Database seeding failed!"
    exit 1
fi

# Start the application
echo "Starting Gunicorn server..."
exec gunicorn app:app
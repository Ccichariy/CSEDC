#!/usr/bin/env python3
import os
import subprocess
import sys

def run_command(command):
    """Run a command and handle errors"""
    print(f"Running: {command}")
    result = subprocess.run(command, shell=True, capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"Error running command: {command}")
        print(f"Error output: {result.stderr}")
        return False
    
    print(f"Success: {result.stdout}")
    return True

def main():
    """Main startup function"""
    print("Starting application...")
    
    # Check if DATABASE_URL is set (production environment)
    if os.environ.get('DATABASE_URL'):
        print("Production environment detected, running database migrations...")
        
        # Run database upgrade
        if not run_command("flask db upgrade"):
            print("Database upgrade failed")
            sys.exit(1)
        
        # Run database seeding
        if not run_command("flask seed all"):
            print("Database seeding failed")
            sys.exit(1)
    else:
        print("Development environment detected, skipping migrations")
    
    # Start the application
    print("Starting Flask application...")
    os.execvp("gunicorn", ["gunicorn", "app:app"])

if __name__ == "__main__":
    main()
# Render Deployment Guide

## Schema Case Mismatch Fix

This project has been updated to resolve the PostgreSQL schema case mismatch issue that was causing `flask seed all` to fail on Render.

### Changes Made

1. **Schema Standardization**: All schema references now use lowercase consistently
2. **Runtime Database Operations**: Database migrations and seeding moved from build-time to runtime
3. **Startup Script**: Created `start.sh` to handle database operations safely

### Render Configuration

#### Environment Variables
Set these environment variables in your Render service:

```
FLASK_APP=app
FLASK_ENV=production
SCHEMA=csec
SECRET_KEY=your_secret_key_here
DATABASE_URL=your_postgresql_url_here
```

**IMPORTANT**: Make sure `SCHEMA` is set to lowercase `csec` (not `CSEC` or `Csec`)

#### Build Command
```bash
# Render will automatically run: docker build
```

#### Start Command
```bash
# The Dockerfile now uses start.sh which handles:
# 1. flask db upgrade
# 2. flask seed all  
# 3. gunicorn app:app
```

### Troubleshooting

#### If deployment still fails:

1. **Check Environment Variables**: Ensure `SCHEMA=csec` (lowercase)
2. **Database Connection**: Verify `DATABASE_URL` is correct
3. **Check Logs**: Look for specific error messages in Render logs

#### Common Issues:

- **Schema not found**: Environment variable `SCHEMA` might be missing or incorrect case
- **Permission denied**: Database user might not have schema creation permissions
- **Connection timeout**: Database might not be ready when migrations run

#### Manual Recovery:

If you need to manually fix the database:

1. Connect to your PostgreSQL database
2. Drop the problematic schema: `DROP SCHEMA IF EXISTS "CSEC" CASCADE;`
3. Ensure only lowercase schema exists: `CREATE SCHEMA IF NOT EXISTS csec;`
4. Redeploy the application

### Testing Locally

To test the schema fix locally:

```bash
# Set environment variables
export SCHEMA=csec
export FLASK_ENV=production

# Run the test script
python test_schema.py

# Or test manually
flask db upgrade
flask seed all
```

### File Changes Summary

- `app/models/db.py`: Added lowercase schema conversion
- `migrations/env.py`: Fixed schema handling and search path
- `migrations/versions/*.py`: Added consistent schema handling
- `Dockerfile`: Moved database operations to runtime
- `start.sh`: New startup script for safe database operations
- `test_schema.py`: Schema configuration test script
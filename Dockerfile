FROM python:3.9.18-alpine3.18

# Install system dependencies
RUN apk add build-base
RUN apk add postgresql-dev gcc python3-dev musl-dev
RUN apk add nodejs npm

ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

WORKDIR /var/www

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN pip install psycopg2

# Copy all files
COPY . .

# Install frontend dependencies and build React app
WORKDIR /var/www/react-vite
RUN npm install
RUN npm run build

# Go back to main directory
WORKDIR /var/www

# Run database migrations and seed
RUN flask db upgrade
RUN flask seed all

# Start the application
CMD gunicorn app:app
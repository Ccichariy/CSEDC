FROM python:3.9.18-alpine3.18


RUN apk add build-base

RUN apk add postgresql-dev gcc python3-dev musl-dev


ARG FLASK_APP
ARG FLASK_ENV

WORKDIR /var/www


COPY requirements.txt .

RUN pip install -r requirements.txt
RUN pip install psycopg2


COPY . .
RUN chmod +x /var/www/startup.py

CMD ["python", "/var/www/startup.py"]
# from __future__ import with_statement
# import os
# import sys
# import logging
# from logging.config import fileConfig

# from sqlalchemy import engine_from_config, pool
# from alembic import context

# # Alembic Config object, which provides
# # access to values within the .ini file in use.
# config = context.config

# # set up Python logging according to the .ini file
# fileConfig(config.config_file_name)
# logger = logging.getLogger('alembic.env')

# # make your app importable
# sys.path.append(os.path.abspath(os.path.join(config.config_file_name, '..', '..')))

# # import your Flask app and db metadata
# from app import create_app
# from app.models.db import db
# from app.models.user import User
# from app.models.video import Video
# from app.models.comment import Comment
# from app.models.playlist import Playlist
# from app.models.filter import Filter

# # create your Flask app, load config, initialize extensions
# app = create_app()

# # tell Alembic the database URL
# config.set_main_option('sqlalchemy.url', app.config['SQLALCHEMY_DATABASE_URI'])
# # point Alembic at your MetaData
# target_metadata = db.metadata

# def run_migrations_offline():
#     url = config.get_main_option("sqlalchemy.url")
#     context.configure(
#         url=url,
#         target_metadata=target_metadata,
#         literal_binds=True,
#     )
#     with context.begin_transaction():
#         context.run_migrations()


# def run_migrations_online():
#     connectable = engine_from_config(
#         config.get_section(config.config_ini_section),
#         prefix='sqlalchemy.',
#         poolclass=pool.NullPool,
#     )
#     with connectable.connect() as connection:
#         context.configure(
#             connection=connection,
#             target_metadata=target_metadata,
#             compare_type=True,
#         )
#         # if you’re using a separate SCHEMA in production, create it first
#         if os.getenv("FLASK_ENV") == "production":
#             connection.execute(f"CREATE SCHEMA IF NOT EXISTS {os.environ['SCHEMA']}")
#             connection.execute(f"SET search_path TO {os.environ['SCHEMA']}")
#         with context.begin_transaction():
#             context.run_migrations()


# if context.is_offline_mode():
#     run_migrations_offline()
# else:
#     run_migrations_online()

from __future__ import with_statement

import logging
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")
if SCHEMA:
    SCHEMA = SCHEMA.lower()


# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
from flask import current_app
config.set_main_option(
    'sqlalchemy.url',
    str(current_app.extensions['migrate'].db.engine.url).replace('%', '%%'))
target_metadata = current_app.extensions['migrate'].db.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline():
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url, target_metadata=target_metadata, literal_binds=True
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """

    # this callback is used to prevent an auto-migration from being generated
    # when there are no changes to the schema
    # reference: http://alembic.zzzcomputing.com/en/latest/cookbook.html
    def process_revision_directives(context, revision, directives):
        if getattr(config.cmd_opts, 'autogenerate', False):
            script = directives[0]
            if script.upgrade_ops.is_empty():
                directives[:] = []
                logger.info('No changes in schema detected.')

    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix='sqlalchemy.',
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            process_revision_directives=process_revision_directives,
            **current_app.extensions['migrate'].configure_args
        )
        # Create a schema (only for PostgreSQL in production)
        if SCHEMA and environment == "production":
            # Check if we're using PostgreSQL
            if connection.engine.dialect.name == 'postgresql':
                connection.execute(f"CREATE SCHEMA IF NOT EXISTS {SCHEMA}")
                connection.execute(f"SET search_path TO {SCHEMA}")

        # Set search path to your schema (only in production)
        with context.begin_transaction():
            # if environment == "production":
            #     context.execute(f"SET search_path TO {SCHEMA}")
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

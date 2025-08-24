from alembic import op
import sqlalchemy as sa

import os
environment = os.getenv("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")
if SCHEMA:
    SCHEMA = SCHEMA.lower()

# revision identifiers, used by Alembic.
revision = '415d1b521e5f'
down_revision = '74dfd4be9fe3'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'video_filters',
        sa.Column('video_id', sa.Integer(), nullable=False),
        sa.Column('filter_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ['video_id'], ['videos.id'],
            name='fk_video_filters_video_id_videos'
        ),
        sa.ForeignKeyConstraint(
            ['filter_id'], ['filters.id'],
            name='fk_video_filters_filter_id_filters'
        ),
        sa.PrimaryKeyConstraint('video_id', 'filter_id')
    )
    
    if environment == "production":
        op.execute(f"ALTER TABLE video_filters SET SCHEMA {SCHEMA};")

def downgrade():
    op.drop_table('video_filters')
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '56ea99591266'
down_revision = '415d1b521e5f'
branch_labels = None
depends_on = None

def upgrade():
    # 1) remove the old FK+column on filters
    with op.batch_alter_table('filters', schema=None) as batch_op:
        batch_op.drop_constraint('fk_filters_video_id_videos', type_='foreignkey')
        batch_op.drop_column('video_id')

    # 2) add filter_id to videos + named FK
    with op.batch_alter_table('videos', schema=None) as batch_op:
        batch_op.add_column(sa.Column('filter_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(
            'fk_videos_filter_id_filters',  # ← explicit name
            'filters',
            ['filter_id'],
            ['id']
        )

def downgrade():
    # undo videos.filter_id
    with op.batch_alter_table('videos', schema=None) as batch_op:
        batch_op.drop_constraint('fk_videos_filter_id_filters', type_='foreignkey')
        batch_op.drop_column('filter_id')

    # restore filters.video_id
    with op.batch_alter_table('filters', schema=None) as batch_op:
        batch_op.add_column(sa.Column('video_id', sa.Integer(), nullable=False))
        batch_op.create_foreign_key(
            'fk_filters_video_id_videos',
            'videos',
            ['video_id'],
            ['id']
        )
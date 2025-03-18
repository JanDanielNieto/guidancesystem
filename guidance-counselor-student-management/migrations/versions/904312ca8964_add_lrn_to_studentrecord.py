"""Add lrn column to student_record

Revision ID: 904312ca8964
Revises: daf9b194b32f
Create Date: 2025-03-17 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '904312ca8964'
down_revision = 'daf9b194b32f'
branch_labels = None
depends_on = None


def upgrade():
    # Add the lrn column with a default value to avoid NOT NULL constraint violation
    with op.batch_alter_table('student_record', schema=None) as batch_op:
        batch_op.add_column(sa.Column('lrn', sa.String(length=12), nullable=False, server_default='TEMP_LRN'))
        batch_op.create_unique_constraint('uq_student_record_lrn', ['lrn'])

    # Remove the server_default after the column has been populated
    with op.batch_alter_table('student_record', schema=None) as batch_op:
        batch_op.alter_column('lrn', server_default=None)


def downgrade():
    with op.batch_alter_table('student_record', schema=None) as batch_op:
        batch_op.drop_constraint('uq_student_record_lrn', type_='unique')
        batch_op.drop_column('lrn')
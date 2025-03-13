"""Create offense_record table

Revision ID: daf9b194b32f
Revises: cd221ce75b74
Create Date: 2025-03-13 15:41:38.742148

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'daf9b194b32f'
down_revision = 'cd221ce75b74'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('offense_record',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('student_id', sa.Integer(), nullable=False),
    sa.Column('offense_type', sa.String(length=100), nullable=False),
    sa.Column('reason', sa.String(length=200), nullable=False),
    sa.Column('additional_info', sa.Text(), nullable=True),
    sa.Column('date_time', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['student_id'], ['student_record.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('student_record', schema=None) as batch_op:
        batch_op.alter_column('ethnic_group',
               existing_type=sa.VARCHAR(length=50),
               nullable=True)
        batch_op.alter_column('contact_number',
               existing_type=sa.VARCHAR(length=15),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('student_record', schema=None) as batch_op:
        batch_op.alter_column('contact_number',
               existing_type=sa.VARCHAR(length=15),
               nullable=False)
        batch_op.alter_column('ethnic_group',
               existing_type=sa.VARCHAR(length=50),
               nullable=False)

    op.drop_table('offense_record')
    # ### end Alembic commands ###

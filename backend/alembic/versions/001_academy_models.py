"""add_od_ai_hub_academy_models

Revision ID: 001_academy
Revises: 
Create Date: 2026-09-21 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001_academy'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Create academy_categories
    op.create_table(
        'academy_categories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('slug', sa.String(length=100), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('tagline', sa.String(length=300), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('accent_color', sa.String(length=50), nullable=False, server_default='#0082ff'),
        sa.Column('icon_letter', sa.String(length=10), nullable=False, server_default='A'),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_academy_categories_id'), 'academy_categories', ['id'], unique=False)
    op.create_index(op.f('ix_academy_categories_slug'), 'academy_categories', ['slug'], unique=True)

    # 2. Add columns to courses
    with op.batch_alter_table('courses', schema=None) as batch_op:
        batch_op.alter_column('institution_id', existing_type=sa.Integer(), nullable=True)
        batch_op.add_column(sa.Column('title', sa.String(length=250), nullable=True))
        batch_op.add_column(sa.Column('slug', sa.String(length=200), nullable=True))
        batch_op.add_column(sa.Column('category_id', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('group_label', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('target_audience', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('duration_value', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('duration_unit', sa.String(length=50), nullable=True, server_default='weeks'))
        batch_op.add_column(sa.Column('mode', sa.String(length=50), nullable=False, server_default='online'))
        batch_op.add_column(sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False, server_default='0.00'))
        batch_op.add_column(sa.Column('discount_price', sa.Numeric(precision=10, scale=2), nullable=True))
        batch_op.add_column(sa.Column('currency', sa.String(length=10), nullable=False, server_default='INR'))
        batch_op.add_column(sa.Column('is_free', sa.Boolean(), nullable=False, server_default='0'))
        batch_op.add_column(sa.Column('batch_size', sa.Integer(), nullable=True))
        batch_op.add_column(sa.Column('short_description', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('full_description', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('highlights', sa.JSON(), nullable=True))
        batch_op.add_column(sa.Column('prerequisites', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('start_date', sa.DateTime(), nullable=True))
        batch_op.add_column(sa.Column('certificate_included', sa.Boolean(), nullable=False, server_default='1'))
        batch_op.add_column(sa.Column('image_url', sa.String(length=500), nullable=True))
        batch_op.add_column(sa.Column('is_featured', sa.Boolean(), nullable=False, server_default='0'))
        batch_op.add_column(sa.Column('status', sa.String(length=50), nullable=False, server_default='draft'))
        batch_op.add_column(sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'))
        batch_op.add_column(sa.Column('updated_at', sa.DateTime(), nullable=True))
        batch_op.create_index(op.f('ix_courses_slug'), ['slug'], unique=True)
        batch_op.create_foreign_key('fk_courses_category_id', 'academy_categories', ['category_id'], ['id'], ondelete='SET NULL')

    # 3. Create enquiries
    op.create_table(
        'enquiries',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=False),
        sa.Column('email', sa.String(length=150), nullable=True),
        sa.Column('class_or_degree', sa.String(length=100), nullable=True),
        sa.Column('message', sa.Text(), nullable=True),
        sa.Column('course_id', sa.Integer(), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='new'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['course_id'], ['courses.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_enquiries_id'), 'enquiries', ['id'], unique=False)

    # 4. Create stats
    op.create_table(
        'stats',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('label', sa.String(length=150), nullable=False),
        sa.Column('value', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('suffix', sa.String(length=20), nullable=True, server_default=''),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_stats_id'), 'stats', ['id'], unique=False)

    # 5. Create testimonials
    op.create_table(
        'testimonials',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('role_or_degree', sa.String(length=150), nullable=False),
        sa.Column('quote', sa.Text(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False, server_default='5'),
        sa.Column('avatar_url', sa.String(length=500), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_testimonials_id'), 'testimonials', ['id'], unique=False)

    # 6. Create faqs
    op.create_table(
        'faqs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('question', sa.String(length=300), nullable=False),
        sa.Column('answer', sa.Text(), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=False, server_default='general'),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_faqs_id'), 'faqs', ['id'], unique=False)


def downgrade() -> None:
    op.drop_table('faqs')
    op.drop_table('testimonials')
    op.drop_table('stats')
    op.drop_table('enquiries')
    with op.batch_alter_table('courses', schema=None) as batch_op:
        batch_op.drop_constraint('fk_courses_category_id', type_='foreignkey')
        batch_op.drop_index(op.f('ix_courses_slug'))
        batch_op.drop_column('updated_at')
        batch_op.drop_column('display_order')
        batch_op.drop_column('status')
        batch_op.drop_column('is_featured')
        batch_op.drop_column('image_url')
        batch_op.drop_column('certificate_included')
        batch_op.drop_column('start_date')
        batch_op.drop_column('prerequisites')
        batch_op.drop_column('highlights')
        batch_op.drop_column('full_description')
        batch_op.drop_column('short_description')
        batch_op.drop_column('batch_size')
        batch_op.drop_column('is_free')
        batch_op.drop_column('currency')
        batch_op.drop_column('discount_price')
        batch_op.drop_column('price')
        batch_op.drop_column('mode')
        batch_op.drop_column('duration_unit')
        batch_op.drop_column('duration_value')
        batch_op.drop_column('target_audience')
        batch_op.drop_column('group_label')
        batch_op.drop_column('category_id')
        batch_op.drop_column('slug')
        batch_op.drop_column('title')
    op.drop_table('academy_categories')

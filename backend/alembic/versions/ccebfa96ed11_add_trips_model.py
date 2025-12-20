"""add trips model

Revision ID: ccebfa96ed11
Revises: 376eaa448b61
Create Date: 2025-12-19 19:17:25.743498

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ccebfa96ed11'
down_revision: Union[str, Sequence[str], None] = '376eaa448b61'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

"""add trips and invitations tables

Revision ID: 459eeec6d918
Revises: 376eaa448b61
Create Date: 2025-12-19 19:05:47.665665

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '459eeec6d918'
down_revision: Union[str, Sequence[str], None] = '376eaa448b61'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ۱. ایجاد تایپ‌های Enum به صورت امن
    bind = op.get_bind()

    # بررسی وجود tripstatus (ongoing, completed)
    has_trip_status = bind.execute(
        sa.text("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tripstatus')")
    ).scalar()
    if not has_trip_status:
        trip_status = postgresql.ENUM('ONGOING', 'COMPLETED', name='tripstatus')
        trip_status.create(bind)

    # بررسی وجود invitationstatus (pending, accepted, rejected)
    has_inv_status = bind.execute(
        sa.text("SELECT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invitationstatus')")
    ).scalar()
    if not has_inv_status:
        invitation_status = postgresql.ENUM('PENDING', 'ACCEPTED', 'REJECTED', name='invitationstatus')
        invitation_status.create(bind)

    # ۲. ایجاد جدول اصلی trips
    op.create_table(
        'trips',
        sa.Column('trip_id', sa.BigInteger(), sa.Identity(always=False), nullable=False),
        sa.Column('owner_id', sa.BigInteger(), nullable=False),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=False),
        sa.Column('status', postgresql.ENUM('ONGOING', 'COMPLETED', name='tripstatus', create_type=False),
                  server_default='ONGOING', nullable=True),
        sa.Column('cover_image', sa.String(length=500), server_default='/static/images/genders/Male.png',
                  nullable=True),
        sa.Column('city_names', postgresql.ARRAY(sa.String()), nullable=True),
        sa.Column('place_ids', postgresql.ARRAY(sa.BigInteger()), nullable=True),
        sa.ForeignKeyConstraint(['owner_id'], ['users.user_id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('trip_id')
    )
    op.create_index(op.f('ix_trips_trip_id'), 'trips', ['trip_id'], unique=False)

    # ۳. ایجاد جدول واسط trip_participants (Many-to-Many)
    op.create_table(
        'trip_participants',
        sa.Column('trip_id', sa.BigInteger(), nullable=False),
        sa.Column('user_id', sa.BigInteger(), nullable=False),
        sa.ForeignKeyConstraint(['trip_id'], ['trips.trip_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('trip_id', 'user_id')
    )

    # ۴. ایجاد جدول trip_invitations
    op.create_table(
        'trip_invitations',
        sa.Column('invitation_id', sa.BigInteger(), sa.Identity(always=False), nullable=False),
        sa.Column('trip_id', sa.BigInteger(), nullable=False),
        sa.Column('sender_id', sa.BigInteger(), nullable=False),
        sa.Column('receiver_id', sa.BigInteger(), nullable=False),
        sa.Column('status',
                  postgresql.ENUM('PENDING', 'ACCEPTED', 'REJECTED', name='invitationstatus', create_type=False),
                  server_default='PENDING', nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['receiver_id'], ['users.user_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['sender_id'], ['users.user_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['trip_id'], ['trips.trip_id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('invitation_id')
    )
    op.create_index(op.f('ix_trip_invitations_invitation_id'), 'trip_invitations', ['invitation_id'], unique=False)


def downgrade() -> None:
    # حذف جداول
    op.drop_index(op.f('ix_trip_invitations_invitation_id'), table_name='trip_invitations')
    op.drop_table('trip_invitations')
    op.drop_table('trip_participants')
    op.drop_index(op.f('ix_trips_trip_id'), table_name='trips')
    op.drop_table('trips')

    # حذف تایپ‌های Enum
    bind = op.get_bind()
    bind.execute(sa.text("DROP TYPE IF EXISTS tripstatus"))
    bind.execute(sa.text("DROP TYPE IF EXISTS invitationstatus"))
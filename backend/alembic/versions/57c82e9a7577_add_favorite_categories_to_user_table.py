"""Add favorite_categories to User table

Revision ID: 57c82e9a7577
Revises: 086511fc9931
Create Date: 2025-12-08 15:04:59.551590

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '57c82e9a7577'
down_revision: Union[str, Sequence[str], None] = '086511fc9931'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add 'Other' to the GenderType enum
    op.execute("ALTER TYPE gendertype ADD VALUE IF NOT EXISTS 'Other'")

    # Add favorite_categories column
    op.add_column('users', sa.Column('favorite_categories', postgresql.ARRAY(sa.String()), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # Remove favorite_categories column
    op.drop_column('users', 'favorite_categories')

    # Note: PostgreSQL doesn't support removing enum values
    # The 'Other' value will remain in the enum type even after downgrade
    pass
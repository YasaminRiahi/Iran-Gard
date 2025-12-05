"""merge branches

Revision ID: 371b83a2cc59
Revises: 1d59d3769093, 4524b5782987
Create Date: 2025-12-05 18:02:47.545666

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '371b83a2cc59'
down_revision: Union[str, Sequence[str], None] = ('1d59d3769093', '4524b5782987')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

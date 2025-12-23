"""Add entertainment places

Revision ID: 34ef4378338e
Revises: 54f19150f584
Create Date: 2025-12-16 16:59:41.732794

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pathlib import Path


# revision identifiers, used by Alembic.
revision: str = '34ef4378338e'
down_revision: Union[str, Sequence[str], None] = '54f19150f584'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    sql_file = Path(__file__).parent.parent.parent.parent / 'database' / 'migrations' / '007_insert_provinces_cities_places_up.sql'
    with open(sql_file, encoding="utf-8") as f:
        op.execute(f.read())


def downgrade() -> None:
    """Downgrade schema."""
    pass

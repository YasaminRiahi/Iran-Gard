"""Add historical places

Revision ID: 54f19150f584
Revises: 00ffb39250de
Create Date: 2025-12-16 14:44:00.629849

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pathlib import Path


# revision identifiers, used by Alembic.
revision: str = '54f19150f584'
down_revision: Union[str, Sequence[str], None] = '00ffb39250de'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    sql_file = Path(__file__).parent.parent.parent.parent / 'Database' / 'migrations' / '006_insert_provinces_cities_places_up.sql'
    with open(sql_file, encoding="utf-8") as f:
        op.execute(f.read())


def downgrade() -> None:
    """Downgrade schema."""
    pass

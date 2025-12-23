"""Add religious places

Revision ID: 376eaa448b61
Revises: 34ef4378338e
Create Date: 2025-12-16 19:15:03.536424

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pathlib import Path


# revision identifiers, used by Alembic.
revision: str = '376eaa448b61'
down_revision: Union[str, Sequence[str], None] = '34ef4378338e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    sql_file = Path(__file__).parent.parent.parent.parent / 'database' / 'migrations' / '008_insert_provinces_cities_places_up.sql'
    with open(sql_file, encoding="utf-8") as f:
        op.execute(f.read())


def downgrade() -> None:
    """Downgrade schema."""
    pass

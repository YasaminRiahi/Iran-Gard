"""Add natural places

Revision ID: 00ffb39250de
Revises: c5914c7462dd
Create Date: 2025-12-12 22:52:12.540272

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pathlib import Path


# revision identifiers, used by Alembic.
revision: str = '00ffb39250de'
down_revision: Union[str, Sequence[str], None] = 'c5914c7462dd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    sql_file = Path(__file__).parent.parent.parent.parent / 'database' / 'migrations' / '005_insert_provinces_cities_places_up.sql'
    with open(sql_file, encoding="utf-8") as f:
        op.execute(f.read())


def downgrade() -> None:
    """Downgrade schema."""
    sql_file = Path(__file__).parent.parent.parent.parent / 'database' / 'migrations' / '005_insert_provinces_cities_places_down.sql'
    with open(sql_file, encoding="utf-8") as f:
        op.execute(f.read())
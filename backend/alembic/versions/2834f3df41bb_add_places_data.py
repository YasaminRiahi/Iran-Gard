"""add places data

Revision ID: 2834f3df41bb
Revises: 371b83a2cc59
Create Date: 2025-12-05 19:11:16.952707

"""

from pathlib import Path
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "2834f3df41bb"
down_revision: Union[str, Sequence[str], None] = "371b83a2cc59"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema - insert sample data."""
    sql_file = (
        Path(__file__).parent.parent.parent.parent
        / "database"
        / "migrations"
        / "002_insert_provinces_cities_places_up.sql"
    )
    with open(sql_file, encoding="utf-8") as f:
        op.execute(f.read())


def downgrade() -> None:
    """Downgrade schema - remove sample data."""
    sql_file = (
        Path(__file__).parent.parent.parent.parent
        / "database"
        / "migrations"
        / "002_insert_provinces_cities_places_down.sql"
    )
    with open(sql_file, encoding="utf-8") as f:
        op.execute(f.read())

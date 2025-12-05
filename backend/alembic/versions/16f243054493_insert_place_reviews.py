"""insert place reviews

Revision ID: 16f243054493
Revises: 2834f3df41bb
Create Date: 2025-12-05 19:55:25.446661

"""

from pathlib import Path
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "16f243054493"
down_revision: Union[str, Sequence[str], None] = "2834f3df41bb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema - insert reviews and social data."""
    sql_file = (
        Path(__file__).parent.parent.parent.parent
        / "database"
        / "migrations"
        / "003_insert_reviews_and_social_data_up.sql"
    )
    with open(sql_file, encoding="utf-8") as f:
        op.execute(f.read())


def downgrade() -> None:
    """Downgrade schema - remove reviews and social data."""
    sql_file = (
        Path(__file__).parent.parent.parent.parent
        / "database"
        / "migrations"
        / "003_insert_reviews_and_social_data_down.sql"
    )
    with open(sql_file, encoding="utf-8") as f:
        op.execute(f.read())

"""insert users

Revision ID: 6d4d00f55204
Revises: ee71417ea180
Create Date: 2025-12-05 12:02:09.742284

"""
from typing import Sequence, Union
from pathlib import Path

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6d4d00f55204'
down_revision: Union[str, Sequence[str], None] = 'ee71417ea180'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    sql_file = Path(__file__).parent.parent.parent.parent / 'database' / 'migrations' / '001_insert_users_up.sql'
    with open(sql_file) as f:
        op.execute(f.read())


def downgrade() -> None:
    """Downgrade schema."""
    sql_file = Path(__file__).parent.parent.parent.parent / 'database' / 'migrations' / '001_insert_users_down.sql'
    with open(sql_file) as f:
        op.execute(f.read())

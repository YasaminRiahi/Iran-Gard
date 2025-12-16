"""Add all devs to users

Revision ID: c5914c7462dd
Revises: 57c82e9a7577
Create Date: 2025-12-10 19:27:31.395344

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pathlib import Path


# revision identifiers, used by Alembic.
revision: str = 'c5914c7462dd'
down_revision: Union[str, Sequence[str], None] = '57c82e9a7577'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade() -> None:
    """Upgrade schema."""
    sql_file = Path(__file__).parent.parent.parent.parent / 'database' / 'migrations' / '004_insert_new_users_up.sql'
    with open(sql_file) as f:
        op.execute(f.read())


def downgrade() -> None:
    """Downgrade schema."""
    sql_file = Path(__file__).parent.parent.parent.parent / 'database' / 'migrations' / '004_insert_new_users_down.sql'
    with open(sql_file) as f:
        op.execute(f.read())


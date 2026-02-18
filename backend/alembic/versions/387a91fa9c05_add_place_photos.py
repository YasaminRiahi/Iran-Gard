"""Add place photos

Revision ID: 387a91fa9c05
Revises: afffdd34c229
Create Date: 2026-02-18 13:08:25.954560

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from pathlib import Path


# revision identifiers, used by Alembic.
revision: str = '387a91fa9c05'
down_revision: Union[str, Sequence[str], None] = 'afffdd34c229'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    sql_file = Path(__file__).parent.parent.parent.parent / 'database' / 'migrations' / '009_update_place_images_up.sql'
    with open(sql_file, encoding="utf-8") as f:
        op.execute(f.read())


def downgrade() -> None:
    """Downgrade schema."""
    pass

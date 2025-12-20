"""add url to city

Revision ID: 5eba10e40f61
Revises: 459eeec6d918
Create Date: 2025-12-19 21:23:35.934765

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5eba10e40f61'
down_revision: Union[str, Sequence[str], None] = '459eeec6d918'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    op.add_column(
        'cities',
        sa.Column(
            'city_pic_url',
            sa.String(length=500),
            nullable=True,
            server_default='static/images/cities/city1.jpg'
        )
    )

def downgrade() -> None:
    op.drop_column('cities', 'city_pic_url')
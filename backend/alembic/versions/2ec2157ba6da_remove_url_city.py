"""remove url city

Revision ID: 2ec2157ba6da
Revises: 5eba10e40f61
Create Date: 2026-01-02 19:21:36.429596

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2ec2157ba6da'
down_revision: Union[str, Sequence[str], None] = '5eba10e40f61'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def downgrade() -> None:
    op.add_column(
        'cities',
        sa.Column(
            'city_pic_url',
            sa.String(length=500),
            nullable=True,
            server_default='static/images/cities/تهران.jpg'
        )
    )

def upgrade() -> None:
    op.drop_column('cities', 'city_pic_url')
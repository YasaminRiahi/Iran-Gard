"""Add expense model

Revision ID: afffdd34c229
Revises: 2068c160360d
Create Date: 2026-01-05 16:45:50.036531

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'afffdd34c229'
down_revision: Union[str, Sequence[str], None] = '2068c160360d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # ---- expenses table ----
    op.create_table(
        "expenses",
        sa.Column("expense_id", sa.BigInteger(), primary_key=True, index=True),
        sa.Column(
            "trip_id",
            sa.BigInteger(),
            sa.ForeignKey("trips.trip_id", ondelete="CASCADE"),
            nullable=False
        ),
        sa.Column("category", sa.String(length=50), nullable=False),
        sa.Column("description", sa.String(length=255), nullable=True),
        sa.Column("amount", sa.BigInteger(), nullable=False),
        sa.Column(
            "payer_id",
            sa.BigInteger(),
            sa.ForeignKey("users.user_id", ondelete="CASCADE"),
            nullable=False
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=True
        ),
    )

    # ---- expense_participants table ----
    op.create_table(
        "expense_participants",
        sa.Column(
            "expense_id",
            sa.BigInteger(),
            sa.ForeignKey("expenses.expense_id", ondelete="CASCADE"),
            primary_key=True
        ),
        sa.Column(
            "user_id",
            sa.BigInteger(),
            sa.ForeignKey("users.user_id", ondelete="CASCADE"),
            primary_key=True
        ),
        sa.Column("share", sa.BigInteger(), nullable=False),
    )

def downgrade():
    op.drop_table("expense_participants")
    op.drop_table("expenses")

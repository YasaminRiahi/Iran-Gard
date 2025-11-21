from sqlalchemy import Column, BigInteger, String, ForeignKey, Date, TIMESTAMP, Numeric, Text, CheckConstraint
from sqlalchemy.sql import func
from app.db.session import Base


class Expense(Base):
    __tablename__ = "expenses"

    expense_num = Column(BigInteger, primary_key=True, autoincrement=True)
    trip_id = Column(BigInteger, ForeignKey("trips.trip_id", ondelete="CASCADE"), primary_key=True, nullable=False)
    payer_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    category = Column(String(100))
    expense_date = Column(Date, server_default=func.current_date())
    description = Column(Text)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    __table_args__ = (
        CheckConstraint('amount >= 0', name='check_amount_positive'),
    )


class ExpenseShare(Base):
    __tablename__ = "expense_shares"

    expense_num = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True)
    trip_id = Column(BigInteger, primary_key=True)
    share_amount = Column(Numeric(12, 2), nullable=False)

    __table_args__ = (
        CheckConstraint('share_amount >= 0', name='check_share_amount_positive'),
    )


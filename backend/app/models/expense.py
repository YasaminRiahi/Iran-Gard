from sqlalchemy import Column, BigInteger, String, ForeignKey,DateTime ,Date, TIMESTAMP, Numeric, Text, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base

class Expense(Base):
    __tablename__ = "expenses"

    expense_id = Column(BigInteger, primary_key=True, index=True)
    trip_id = Column(
        BigInteger,
        ForeignKey("trips.trip_id", ondelete="CASCADE"),
        nullable=False
    )
    category = Column(String(50), nullable=False)
    description = Column(String(255), nullable=True)
    amount = Column(BigInteger, nullable=False)

    payer_id = Column(
        BigInteger,
        ForeignKey("users.user_id", ondelete="CASCADE"),
        nullable=False
    )

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    participants = relationship(
        "ExpenseParticipant",
        cascade="all, delete",
        back_populates="expense"
    )


class ExpenseParticipant(Base):
    __tablename__ = "expense_participants"

    expense_id = Column(
        BigInteger,
        ForeignKey("expenses.expense_id", ondelete="CASCADE"),
        primary_key=True
    )
    user_id = Column(
        BigInteger,
        ForeignKey("users.user_id", ondelete="CASCADE"),
        primary_key=True
    )
    share = Column(BigInteger, nullable=False)

    expense = relationship("Expense", back_populates="participants")


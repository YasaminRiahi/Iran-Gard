from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal


class ExpenseCreate(BaseModel):
    payer_id: int
    amount: Decimal
    category: Optional[str] = None
    expense_date: Optional[date] = None
    description: Optional[str] = None
    shared_with: List[int] = []  # List of user_ids to split expense


class ExpenseUpdate(BaseModel):
    amount: Optional[Decimal] = None
    category: Optional[str] = None
    expense_date: Optional[date] = None
    description: Optional[str] = None


class ExpenseResponse(BaseModel):
    expense_num: int
    trip_id: int
    payer_id: int
    amount: Decimal
    category: Optional[str] = None
    expense_date: date
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ExpenseShareResponse(BaseModel):
    expense_num: int
    user_id: int
    trip_id: int
    share_amount: Decimal

    class Config:
        from_attributes = True


class SettlementSummary(BaseModel):
    """Summary of who owes whom"""
    from_user_id: int
    to_user_id: int
    amount: Decimal


class TripExpenseSummary(BaseModel):
    """Overall expense summary for a trip"""
    total_expenses: Decimal
    user_balances: dict[int, Decimal]  # user_id -> balance (positive = owed, negative = owes)
    settlements: List[SettlementSummary]


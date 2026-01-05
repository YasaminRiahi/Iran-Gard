from pydantic import BaseModel, field_validator
from typing import List, Optional
from datetime import datetime

class ExpenseParticipantCreate(BaseModel):
    user_id: int
    share: int


class ExpenseCreate(BaseModel):
    category: str
    description: Optional[str] = None
    amount: int
    payer_id: int
    participants: List[ExpenseParticipantCreate]

    @field_validator("participants")
    @classmethod
    def validate_shares(cls, participants, info):
        amount = info.data.get("amount")
        if amount and sum(p.share for p in participants) != amount:
            raise ValueError("مجموع سهم‌ها باید برابر amount باشد")
        return participants


class ExpenseUpdate(ExpenseCreate):
    pass


class ExpenseParticipantResponse(BaseModel):
    user_id: int
    share: int

    class Config:
        from_attributes = True


class ExpenseResponse(BaseModel):
    expense_id: int
    category: str
    description: Optional[str]
    amount: int
    payer_id: int
    participants: List[ExpenseParticipantResponse]
    created_at: Optional[datetime]


    class Config:
        from_attributes = True


class SettlementItem(BaseModel):
    from_id: int
    to_id: int
    from_name: str
    to_name: str
    amount: int



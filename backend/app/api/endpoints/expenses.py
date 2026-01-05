from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_current_user
from app.db.session import get_db

from app.schemas.expense import (
    ExpenseCreate, ExpenseUpdate, ExpenseResponse
)
from app.models.expense import Expense
from app.crud import expense as crud_expense


router = APIRouter(
    prefix="/trips/{trip_id}/expenses",
    tags=["Expenses"]
)


@router.post("/", response_model=ExpenseResponse, status_code=201)
def create_expense(
    trip_id: int,
    expense_in: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return crud_expense.create_expense(db, trip_id, expense_in)



@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    trip_id: int,
    expense_id: int,
    expense_in: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    expense = db.query(Expense).filter(
        Expense.expense_id == expense_id,
        Expense.trip_id == trip_id
    ).first()

    if not expense:
        raise HTTPException(404, "Expense not found")

    return crud_expense.update_expense(db, expense, expense_in)


@router.delete("/{expense_id}", status_code=204)
def delete_expense(
    trip_id: int,
    expense_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    expense = db.query(Expense).filter(
        Expense.expense_id == expense_id,
        Expense.trip_id == trip_id
    ).first()

    if not expense:
        raise HTTPException(404, "Expense not found")

    crud_expense.delete_expense(db, expense)


@router.get("/settlement")
def settlement(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    settlements = crud_expense.calculate_settlement(db, trip_id)
    return {
        "success": True,
        "data": {
            "settlements": settlements
        }
    }

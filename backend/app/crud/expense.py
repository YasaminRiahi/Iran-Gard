from sqlalchemy.orm import Session
from app.models.expense import Expense, ExpenseShare
from app.schemas.expense import ExpenseCreate, ExpenseUpdate
from typing import List, Optional
from decimal import Decimal


def create_expense(db: Session, trip_id: int, expense: ExpenseCreate) -> Expense:
    """Create a new expense."""
    db_expense = Expense(
        trip_id=trip_id,
        payer_id=expense.payer_id,
        amount=expense.amount,
        category=expense.category,
        expense_date=expense.expense_date,
        description=expense.description
    )
    db.add(db_expense)
    db.flush()

    # Create expense shares
    if expense.shared_with:
        share_amount = expense.amount / len(expense.shared_with)
        for user_id in expense.shared_with:
            share = ExpenseShare(
                expense_num=db_expense.expense_num,
                trip_id=trip_id,
                user_id=user_id,
                share_amount=share_amount
            )
            db.add(share)

    db.commit()
    db.refresh(db_expense)
    return db_expense


def get_trip_expenses(db: Session, trip_id: int) -> List[Expense]:
    """Get all expenses for a trip."""
    return db.query(Expense).filter(Expense.trip_id == trip_id).all()


def get_expense(db: Session, trip_id: int, expense_num: int) -> Optional[Expense]:
    """Get a specific expense."""
    return db.query(Expense).filter(
        Expense.trip_id == trip_id,
        Expense.expense_num == expense_num
    ).first()


def update_expense(db: Session, trip_id: int, expense_num: int, expense_update: ExpenseUpdate) -> Optional[Expense]:
    """Update an expense."""
    db_expense = get_expense(db, trip_id, expense_num)
    if not db_expense:
        return None

    update_data = expense_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_expense, field, value)

    db.commit()
    db.refresh(db_expense)
    return db_expense


def delete_expense(db: Session, trip_id: int, expense_num: int) -> bool:
    """Delete an expense."""
    db_expense = get_expense(db, trip_id, expense_num)
    if db_expense:
        db.delete(db_expense)
        db.commit()
        return True
    return False


def get_expense_shares(db: Session, trip_id: int, expense_num: int) -> List[ExpenseShare]:
    """Get all shares for an expense."""
    return db.query(ExpenseShare).filter(
        ExpenseShare.trip_id == trip_id,
        ExpenseShare.expense_num == expense_num
    ).all()


def calculate_user_balances(db: Session, trip_id: int) -> dict[int, Decimal]:
    """
    Calculate balance for each user in the trip.
    Positive balance = user is owed money
    Negative balance = user owes money
    """
    balances = {}

    # Get all expenses
    expenses = get_trip_expenses(db, trip_id)

    for expense in expenses:
        # Payer gets positive balance (they paid)
        balances[expense.payer_id] = balances.get(expense.payer_id, Decimal(0)) + expense.amount

        # Get shares for this expense
        shares = get_expense_shares(db, trip_id, expense.expense_num)
        for share in shares:
            # Each person who shares the expense gets negative balance (they owe)
            balances[share.user_id] = balances.get(share.user_id, Decimal(0)) - share.share_amount

    return balances


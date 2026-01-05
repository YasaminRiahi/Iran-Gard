from sqlalchemy.orm import Session
from app.models.expense import Expense, ExpenseParticipant
from app.schemas.expense import ExpenseCreate, ExpenseUpdate
from app.crud import user as user_crud

def create_expense(db: Session, trip_id: int, expense_in: ExpenseCreate):
    expense = Expense(
        trip_id=trip_id,
        category=expense_in.category,
        description=expense_in.description,
        amount=expense_in.amount,
        payer_id=expense_in.payer_id
    )
    db.add(expense)
    db.flush()

    for p in expense_in.participants:
        db.add(
            ExpenseParticipant(
                expense_id=expense.expense_id,
                user_id=p.user_id,
                share=p.share
            )
        )

    db.commit()
    db.refresh(expense)
    return expense


def update_expense(db: Session, expense: Expense, expense_in: ExpenseUpdate):
    expense.category = expense_in.category
    expense.description = expense_in.description
    expense.amount = expense_in.amount
    expense.payer_id = expense_in.payer_id

    db.query(ExpenseParticipant).filter(
        ExpenseParticipant.expense_id == expense.expense_id
    ).delete()

    for p in expense_in.participants:
        db.add(
            ExpenseParticipant(
                expense_id=expense.expense_id,
                user_id=p.user_id,
                share=p.share
            )
        )

    db.commit()
    db.refresh(expense)
    return expense


def delete_expense(db: Session, expense: Expense):
    db.delete(expense)
    db.commit()

def calculate_settlement(db: Session, trip_id: int):
    expenses = db.query(Expense).filter(Expense.trip_id == trip_id).all()

    paid = {}
    owed = {}

    for exp in expenses:
        paid[exp.payer_id] = paid.get(exp.payer_id, 0) + exp.amount
        for p in exp.participants:
            owed[p.user_id] = owed.get(p.user_id, 0) + p.share

    balances = {
        user_id: paid.get(user_id, 0) - owed.get(user_id, 0)
        for user_id in set(paid) | set(owed)
    }

    debtors = [(u, -b) for u, b in balances.items() if b < 0]
    creditors = [(u, b) for u, b in balances.items() if b > 0]

    settlements = []
    i = j = 0

    while i < len(debtors) and j < len(creditors):
        d_user, d_amt = debtors[i]
        c_user, c_amt = creditors[j]

        pay = min(d_amt, c_amt)
        settlements.append({
            "from_id": d_user,
            "from_name": user_crud.get_user_by_id(db,d_user).username,
            "to_name": user_crud.get_user_by_id(db,c_user).username,
            "to_id": c_user,
            "amount": pay
        })

        debtors[i] = (d_user, d_amt - pay)
        creditors[j] = (c_user, c_amt - pay)

        if debtors[i][1] == 0:
            i += 1
        if creditors[j][1] == 0:
            j += 1

    return settlements

def get_expenses_by_trip(db: Session, trip_id: int):
    return db.query(Expense).filter(Expense.trip_id == trip_id).all()
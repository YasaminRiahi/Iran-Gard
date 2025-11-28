# Adding a New Feature to the Backend

## Order of Implementation

1. **Model** (`app/models/feature_name.py`) - Database table
2. **Schema** (`app/schemas/feature_name.py`) - Request/response validation
3. **CRUD** (`app/crud/feature_name.py`) - Database operations
4. **Endpoints** (`app/api/endpoints/feature_names.py`) - API routes
5. **Register** (`app/api/api.py`) - Include router
6. **Migration** - Generate and apply with Alembic

## Quick Example

### 1. Model
```python
from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"))
```

### 2. Schema
```python
from pydantic import BaseModel

class ItemCreate(BaseModel):
    name: str

class ItemResponse(BaseModel):
    id: int
    name: str
    
    class Config:
        from_attributes = True
```

### 3. CRUD
```python
def create_item(db: Session, item: ItemCreate, user_id: int):
    db_item = Item(**item.dict(), user_id=user_id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def get_item(db: Session, item_id: int):
    return db.query(Item).filter(Item.id == item_id).first()
```

### 4. Endpoints
```python
from fastapi import APIRouter, Depends
from app.api.deps import get_current_user

router = APIRouter(prefix="/items", tags=["items"])

@router.post("/", response_model=ItemResponse)
def create(item: ItemCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return crud.create_item(db, item, current_user.user_id)

@router.get("/{item_id}", response_model=ItemResponse)
def read(item_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_item = crud.get_item(db, item_id)
    if not db_item or db_item.user_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="Not found")
    return db_item
```

### 5. Register in `api.py`
```python
from app.api.endpoints import items
api_router.include_router(items.router)
```

### 6. Create Migration
```bash
python -m alembic revision --autogenerate -m "Add Item table"
python -m alembic upgrade head
```

## Key Points

- ✅ Always protect authenticated endpoints with `get_current_user`
- ✅ Always check user ownership before returning data
- ✅ Use `from_attributes = True` in schemas for ORM conversion
- ✅ Commit database changes and refresh objects
- ✅ Use appropriate HTTP status codes (201 for create, 204 for delete)
- ✅ Create migrations before deploying

## Testing

Visit `http://localhost:8000/api/docs` to test endpoints in Swagger UI.

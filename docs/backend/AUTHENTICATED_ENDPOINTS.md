# Authenticated Endpoints

Use `Depends(get_current_user)` to require login. It extracts user from `Authorization: Bearer <token>` header.

```python
from app.api.deps import get_current_user
from fastapi import Depends, HTTPException, status

@router.post("/favorites")
def create_favorite(
    place_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="لطفاً وارد شوید")
    return {"success": True}
```

**Public endpoint** (no auth): remove `Depends(get_current_user)`

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User, GenderType
from app.schemas.user import UserResponse, SearchUserResponse, UserUpdateInformation,UserEditResponse
from app.crud import user as user_crud
from app.crud import friendship as friendship_crud

router = APIRouter(prefix="/users", tags=["users"])



@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cur_gen = current_user.gender


    cur_profile = current_user.profile_url
    if cur_gen == "Male":
        cur_profile = "/static/images/genders/Male.png"
    if cur_gen == "Female":
        cur_profile = "/static/images/genders/Female.png"
    if cur_gen == "Other":
        cur_profile = "/static/images/genders/Other.png"

    user_response = {
        "user_id": current_user.user_id,
        "username": current_user.username,
        "email": current_user.email,
        "gender": current_user.gender,
        "full_name": current_user.full_name,
        "about_me": current_user.about_me,
        "profile_url":cur_profile,
        "number_of_trips":0,
        "number_of_friends":friendship_crud.get_number_of_friends(db, current_user.user_id),
        "favorite_categories": current_user.favorite_categories,
    }

    return user_response


@router.get("/search", response_model=List[SearchUserResponse])
def search_users(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Search for users by username or email."""
    users = user_crud.search_users(db, query=q)
    ret_users = []
    for test_user in users:
        if test_user.user_id == current_user.user_id:
            continue
        cur_user = {
        "user_id": test_user.user_id,
        "username": test_user.username,
        "full_name": test_user.full_name,
        "about_me": test_user.about_me,
        "profile_url": test_user.profile_url,
        "friendship_status":friendship_crud.are_friends(db, test_user.user_id, current_user.user_id),
        }
        ret_users.append(cur_user)
    return ret_users






@router.put("/update-information",response_model=UserEditResponse, status_code=status.HTTP_200_OK
)
def update_user_information(
        user_data: UserUpdateInformation,
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
):
    """
    Update the current user's information.

    - **full_name**: User's full name (optional)
    - **about_me**: User's bio/description (optional)
    - **gender**: User's gender (optional)
    - **favorite_categories**: List of favorite categories (optional)
    """

    updated_user = user_crud.update_user_information(
        db=db,
        user_id=current_user.user_id,
        user_data=user_data
    )

    cur_gen = current_user.gender
    cur_profile = current_user.profile_url
    if cur_gen == "Male":
        cur_profile ="/static/images/genders/Male.png"
    if cur_gen == "Female":
        cur_profile = "/static/images/genders/Female.png"
    if cur_gen == "Other":
        cur_profile = "/static/images/genders/Other.png"


    cur_user = {
        "user_id": current_user.user_id,
        "username": current_user.username,
        "full_name": updated_user.full_name,
        "gender":current_user.gender,
        "about_me": updated_user.about_me,
        "profile_url": updated_user.profile_url,
        "favorite_categories": updated_user.favorite_categories,
    }


    if not cur_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return cur_user


@router.get("/{user_id}/full-info", response_model=UserResponse)
def get_user_full_info(
        user_id: int,
        db: Session = Depends(get_db)
):
    """
    اطلاعات کامل یک کاربر را بر اساس آی‌دی برمی‌گرداند.
    """
    current_user = user_crud.get_user_by_id(db, user_id=user_id)
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")


    user_response = {
        "user_id": current_user.user_id,
        "username": current_user.username,
        "email": current_user.email,
        "gender": current_user.gender,
        "full_name": current_user.full_name,
        "about_me": current_user.about_me,
        "profile_url":current_user.profile_url,
        "number_of_trips":0,
        "number_of_friends":friendship_crud.get_number_of_friends(db, current_user.user_id),
        "favorite_categories": current_user.favorite_categories,
    }

    return user_response
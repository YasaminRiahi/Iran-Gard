from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import get_current_user
from app.crud import trip as trip_crud
from app.crud import friendship as friendship_crud
from app.crud import user as user_crud
from app.db.session import get_db
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.trip import TripResponse,TripCreate,InvitationResponse,TripDetailsResponse
from typing import List, Optional
from app.models.trip import TripParticipant,TripInvitation,InvitationStatus
from app.schemas.friendship import FriendInviteDetail


router = APIRouter(prefix="/trips", tags=["trips"])

@router.post("/create_trip", response_model=TripResponse)
def create_trip(trip_in: TripCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return trip_crud.create_trip(db, trip_in, current_user.user_id)


@router.post("/invite/{trip_id}/{friend_id}")
def invite_friend(
        trip_id: int, friend_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    if not trip_crud.is_user_in_trip(db, trip_id, current_user.user_id):
        raise HTTPException(status_code=403, detail="You must be a member of the trip to invite others.")

    if not friendship_crud.are_friends(db, current_user.user_id, friend_id):
        raise HTTPException(status_code=400, detail="You can only invite your friends.")

    if trip_crud.is_user_in_trip(db, trip_id, friend_id):
        raise HTTPException(status_code=400, detail="This friend is already a member of the trip.")

    invitation = trip_crud.send_invitation(db, trip_id, current_user.user_id, friend_id)
    if not invitation:
        raise HTTPException(status_code=400, detail="An invitation is already pending for this friend.")

    return invitation


@router.get("/invitations", response_model=List[InvitationResponse])
def get_my_invitations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return trip_crud.get_user_invitations(db, current_user.user_id)

@router.patch("/invitations/{invitation_id}/respond")
def respond_invite(invitation_id: int, accept: bool, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    res = trip_crud.respond_invitation(db, invitation_id, current_user.user_id, accept)
    if not res: raise HTTPException(status_code=404, detail="Invitation not found")
    return {"message": "Success"}

@router.get("/ongoing", response_model=List[TripResponse])
def get_ongoing(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return trip_crud.get_trips_by_time(db, current_user.user_id, ongoing=True)

@router.get("/finished", response_model=List[TripResponse])
def get_finished(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return trip_crud.get_trips_by_time(db, current_user.user_id, ongoing=False)


@router.get("/{trip_id}/details", response_model=TripDetailsResponse)
def get_trip_details(
        trip_id: int,
        db: Session = Depends(get_db)
):
    """
    دریافت اطلاعات کامل سفر به همراه لیست آی‌دی اعضا و تعداد آن‌ها
    """
    trip = trip_crud.get_trip_by_id(db, trip_id=trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    participants_query = db.query(TripParticipant.user_id).filter(
        TripParticipant.trip_id == trip_id
    ).all()

    participant_ids = [p[0] for p in participants_query]

    return {
        **trip.__dict__,
        "participants": participant_ids,
        "participants_count": len(participant_ids)
    }


#if we decided to let others add too
@router.get("/{trip_id}/available-friends", response_model=List[FriendInviteDetail])
def get_available_friends_for_trip(
        trip_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    نمایش آی‌دی دوستانی که کاربر می‌تواند به این سفر دعوت کند.
    """
    friends = friendship_crud.get_friends(db, current_user.user_id)
    friend_ids = {f.user_id for f in friends}

    participants = db.query(TripParticipant.user_id).filter(
        TripParticipant.trip_id == trip_id
    ).all()
    participant_ids = {p[0] for p in participants}

    pending_invites = db.query(TripInvitation.receiver_id).filter(
        TripInvitation.trip_id == trip_id,
        TripInvitation.status == InvitationStatus.PENDING
    ).all()
    pending_ids = {i[0] for i in pending_invites}

    available_ids = friend_ids - participant_ids - pending_ids

    available_friends = []
    for cur_id in available_ids:
        user = user_crud.get_user_by_id(db, cur_id)
        available_friends.append(user)

    return available_friends


@router.get("/available-friends", response_model=List[FriendInviteDetail])
def get_available_friends(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """
    نمایش آی‌دی دوستانی که کاربر می‌تواند به این سفر دعوت کند.
    """
    friends = friendship_crud.get_friends(db, current_user.user_id)
    # friend_ids = {f.user_id for f in friends}
    #
    # available_ids = friend_ids
    #
    # available_friends = []
    # for cur_id in available_ids:
    #     user = user_crud.get_user_by_id(db, cur_id)
    #     available_friends.append(user)
    #
    # return available_friends

    return friends
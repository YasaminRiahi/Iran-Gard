from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from app.models.trip import Trip, TripParticipant, TripInvitation, TripStatus, InvitationStatus
from app.schemas.trip import TripCreate
from datetime import datetime

def create_trip(db: Session, trip_in: TripCreate, owner_id: int):
    db_trip = Trip(**trip_in.dict(), owner_id=owner_id)
    db.add(db_trip)
    db.flush()
    participant = TripParticipant(trip_id=db_trip.trip_id, user_id=owner_id)
    db.add(participant)
    db.commit()
    db.refresh(db_trip)
    return db_trip

def is_user_in_trip(db: Session, trip_id: int, user_id: int) -> bool:
    """بررسی اینکه آیا کاربر عضو این سفر هست یا خیر"""
    return db.query(TripParticipant).filter(
        TripParticipant.trip_id == trip_id,
        TripParticipant.user_id == user_id
    ).first() is not None


def send_invitation(db: Session, trip_id: int, sender_id: int, receiver_id: int):
    existing = db.query(TripInvitation).filter(
        TripInvitation.trip_id == trip_id,
        TripInvitation.receiver_id == receiver_id,
        TripInvitation.status == InvitationStatus.PENDING
    ).first()

    if existing:
        return None

    invitation = TripInvitation(trip_id=trip_id, sender_id=sender_id, receiver_id=receiver_id)
    db.add(invitation)
    db.commit()
    db.refresh(invitation)
    return invitation

def get_user_invitations(db: Session, user_id: int):
    return db.query(TripInvitation).filter(TripInvitation.receiver_id == user_id, TripInvitation.status == "pending").all()

def respond_invitation(db: Session, invitation_id: int, user_id: int, accept: bool):
    inv = db.query(TripInvitation).filter(TripInvitation.invitation_id == invitation_id, TripInvitation.receiver_id == user_id).first()
    if not inv: return None
    inv.status = InvitationStatus.ACCEPTED if accept else InvitationStatus.REJECTED
    if accept:
        db.add(TripParticipant(trip_id=inv.trip_id, user_id=user_id))
    db.commit()
    return inv

def get_trips_by_time(db: Session, user_id: int, ongoing: bool):
    today = datetime.now().date()
    trip_ids = db.query(TripParticipant.trip_id).filter(TripParticipant.user_id == user_id).subquery()
    query = db.query(Trip).filter(Trip.trip_id.in_(trip_ids))
    if ongoing:
        return query.filter(Trip.start_date <= today, Trip.end_date >= today).all()
    return query.filter(Trip.end_date < today).all()

def get_trip_by_id(db: Session, trip_id: int):
    return db.query(Trip).filter(Trip.trip_id == trip_id).first()
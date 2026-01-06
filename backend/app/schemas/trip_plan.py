from pydantic import BaseModel, Field
from typing import List, Optional


# Request schemas
class CreatePlanRequest(BaseModel):
    """
    Create Daily Plan Request
    
    **Required fields:**
    - title: Plan title (e.g., "روز اول")
    - city: City name for the plan
    - locationIds: List of place IDs to include in the plan
    """
    title: str = Field(..., description="Plan title (e.g., 'روز اول')")
    city: str = Field(..., description="City name")
    locationIds: List[int] = Field(..., description="List of place IDs in order")


class UpdatePlanOrderRequest(BaseModel):
    """
    Update Plan Location Order Request
    
    **Required fields:**
    - locationIds: Ordered list of place IDs (defines new order)
    """
    locationIds: List[int] = Field(..., description="Ordered list of place IDs")


class AddLocationToPlanRequest(BaseModel):
    """
    Add Location to Plan Request
    
    **Required fields:**
    - locationId: Place ID to add to the plan
    """
    locationId: int = Field(..., description="Place ID to add")


class UpdatePlanRequest(BaseModel):
    """
    Update Complete Plan Request
    
    **Required fields:**
    - title: Updated plan title
    - city: Updated city name
    - locationIds: Complete ordered list of place IDs (replaces all locations)
    """
    title: str = Field(..., description="Updated plan title")
    city: str = Field(..., description="Updated city name")
    locationIds: List[int] = Field(..., description="Complete ordered list of place IDs")


class VotePlanRequest(BaseModel):
    """
    Vote on Plan Request
    
    **Required fields:**
    - voteType: 'like', 'dislike', or null to remove vote
    """
    voteType: Optional[str] = Field(None, description="Vote type: 'like', 'dislike', or null")


class AutoGeneratePlansRequest(BaseModel):
    """
    Auto Generate Plans Request
    
    **Required fields:**
    - locationsPerDay: Number of locations to include per day
    """
    locationsPerDay: int = Field(..., description="Number of locations per day", gt=0)


# Response schemas
class PlanLocationResponse(BaseModel):
    """
    Plan Location Response
    
    Contains location details within a plan including order and estimated time.
    """
    id: int = Field(..., description="Place ID")
    name: str = Field(..., description="Place name")
    estimatedTime: Optional[str] = Field(None, description="Estimated visit time")
    order: int = Field(..., description="Order in the plan")


class PlanVotesResponse(BaseModel):
    """
    Plan Vote Statistics
    
    Contains vote counts for a plan.
    """
    likes: int = Field(..., description="Number of likes")
    dislikes: int = Field(..., description="Number of dislikes")


class PlanResponse(BaseModel):
    """
    Plan Response
    
    Contains complete plan details including locations and votes.
    """
    id: int = Field(..., description="Plan ID")
    title: str = Field(..., description="Plan title")
    city: str = Field(..., description="City name")
    locations: List[PlanLocationResponse] = Field(..., description="List of locations in order")
    votes: PlanVotesResponse = Field(..., description="Vote statistics")
    userVote: Optional[str] = Field(None, description="Current user's vote")


class CreatePlanSuccessResponse(BaseModel):
    """
    Create Plan Success Response
    """
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Success message")
    data: PlanResponse = Field(..., description="Created plan details")


class UpdateOrderLocationResponse(BaseModel):
    """
    Location with updated order
    """
    id: int = Field(..., description="Place ID")
    order: int = Field(..., description="New order")


class UpdateOrderDataResponse(BaseModel):
    """
    Update Order Data Response
    """
    id: int = Field(..., description="Plan ID")
    locations: List[UpdateOrderLocationResponse] = Field(..., description="Locations with updated order")


class UpdateOrderSuccessResponse(BaseModel):
    """
    Update Order Success Response
    """
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Success message")
    data: UpdateOrderDataResponse = Field(..., description="Updated plan data")


class AddLocationSuccessResponse(BaseModel):
    """
    Add Location to Plan Success Response
    """
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Success message")


class DeleteLocationSuccessResponse(BaseModel):
    """
    Delete Location from Plan Success Response
    """
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Success message")


class DeletePlanSuccessResponse(BaseModel):
    """
    Delete Plan Success Response
    """
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Success message")


class VotePlanDataResponse(BaseModel):
    """
    Vote Plan Data Response
    """
    votes: PlanVotesResponse = Field(..., description="Updated vote statistics")
    userVote: Optional[str] = Field(None, description="Current user's vote")


class VotePlanSuccessResponse(BaseModel):
    """
    Vote Plan Success Response
    """
    success: bool = Field(..., description="Operation success status")
    data: VotePlanDataResponse = Field(..., description="Vote data")


class AutoGeneratePlansSuccessResponse(BaseModel):
    """
    Auto Generate Plans Success Response
    """
    success: bool = Field(..., description="Operation success status")
    message: str = Field(..., description="Success message")
    data: List[PlanResponse] = Field(..., description="List of generated plans")


class GetPlansResponse(BaseModel):
    """
    Get Trip Plans Response
    
    Returns all plans for a trip.
    """
    plans: List[PlanResponse] = Field(..., description="List of all plans for the trip")

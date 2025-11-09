from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from app.services.database_service import db_service

router = APIRouter()

class CreateTeamRequest(BaseModel):
    name: str
    description: Optional[str] = None

class UpdateTeamRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class AddTeamMemberRequest(BaseModel):
    userId: int
    teamId: int

@router.get("/")
async def get_teams():
    """Get all teams with their members"""
    return await db_service.get_all_teams()

@router.post("/")
async def create_team(team_data: CreateTeamRequest):
    """Create a new team"""
    try:
        team = await db_service.create_team(team_data.model_dump())
        return {"message": "Team created successfully", "team": team}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating team: {str(e)}")

@router.put("/{team_id}")
async def update_team(team_id: int, team_data: UpdateTeamRequest):
    """Update a team"""
    try:
        team = await db_service.update_team(team_id, team_data.model_dump(exclude_unset=True))
        if not team:
            raise HTTPException(status_code=404, detail="Team not found")
        return {"message": "Team updated successfully", "team": team}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating team: {str(e)}")

@router.delete("/{team_id}")
async def delete_team(team_id: int):
    """Delete a team"""
    try:
        success = await db_service.delete_team(team_id)
        if not success:
            raise HTTPException(status_code=404, detail="Team not found")
        return {"message": "Team deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting team: {str(e)}")

@router.post("/members")
async def add_team_member(member_data: AddTeamMemberRequest):
    """Add a user to a team"""
    try:
        member = await db_service.add_team_member(member_data.userId, member_data.teamId)
        return {"message": "Member added successfully", "member": member}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding member: {str(e)}")

@router.delete("/members/{member_id}")
async def remove_team_member(member_id: int):
    """Remove a user from a team"""
    try:
        success = await db_service.remove_team_member(member_id)
        if not success:
            raise HTTPException(status_code=404, detail="Team member not found")
        return {"message": "Member removed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing member: {str(e)}")

@router.get("/{team_id}/members")
async def get_team_members(team_id: int):
    """Get all members of a team"""
    try:
        members = await db_service.get_team_members(team_id)
        return {"message": "Team members retrieved successfully", "members": members}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving team members: {str(e)}")

@router.get("/user/{user_id}")
async def get_user_teams(user_id: int):
    """Get all teams that a user belongs to"""
    try:
        teams = await db_service.get_user_teams(user_id)
        return {"message": "User teams retrieved successfully", "teams": teams}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving user teams: {str(e)}")


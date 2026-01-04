from app.utils.firebase import db
from datetime import datetime


def save_career_analysis(
    user_id: str,
    profile: dict,
    career_decision: dict,
    roadmap: dict
):
    data = {
        "profile": profile,
        "career_decision": career_decision,
        "roadmap": roadmap,
        "created_at": datetime.utcnow()
    }

    db.collection("users") \
      .document(user_id) \
      .collection("analyses") \
      .add(data)

    # Also save as active roadmap
    save_active_roadmap(user_id, career_decision, roadmap)

    return True


def save_active_roadmap(user_id: str, career_decision: dict, roadmap: dict):
    """Save the current active roadmap with progress tracking"""
    
    # Initialize status for each phase
    if "roadmap" in roadmap:
        for phase in roadmap["roadmap"]:
            phase["status"] = "pending"
            phase["completed_at"] = None

    data = {
        "career_decision": career_decision,
        "learning_roadmap": roadmap,
        "progress": {
            "completed_phases": 0,
            "total_phases": len(roadmap.get("roadmap", [])),
            "streak_days": 0,
            "last_activity_date": None
        },
        "updated_at": datetime.utcnow()
    }

    db.collection("users").document(user_id).collection("active_roadmap").document("current").set(data)
    return True


def get_active_roadmap(user_id: str):
    """Get the current active roadmap"""
    doc = db.collection("users").document(user_id).collection("active_roadmap").document("current").get()
    if doc.exists:
        return doc.to_dict()
    return None


def update_phase_status(user_id: str, phase_index: int, status: str):
    """Update the status of a specific phase"""
    ref = db.collection("users").document(user_id).collection("active_roadmap").document("current")
    doc = ref.get()
    
    if not doc.exists:
        return False
        
    data = doc.to_dict()
    roadmap = data.get("learning_roadmap", {}).get("roadmap", [])
    
    if 0 <= phase_index < len(roadmap):
        roadmap[phase_index]["status"] = status
        if status == "completed":
            roadmap[phase_index]["completed_at"] = datetime.utcnow().isoformat()
            
            # Update progress count
            completed_count = sum(1 for p in roadmap if p.get("status") == "completed")
            data["progress"]["completed_phases"] = completed_count
            
            # Update streak
            update_streak(data["progress"])
            
        ref.update({
            "learning_roadmap.roadmap": roadmap,
            "progress": data["progress"],
            "updated_at": datetime.utcnow()
        })
        return True
        
    return False


def update_streak(progress_data: dict):
    """Calculate and update streak logic"""
    now = datetime.utcnow()
    last_active = progress_data.get("last_activity_date")
    
    if last_active:
        last_date = datetime.fromisoformat(last_active).date()
        today = now.date()
        diff = (today - last_date).days
        
        if diff == 1:
            progress_data["streak_days"] += 1
        elif diff > 1:
            progress_data["streak_days"] = 1
        # If diff == 0, streak remains same
    else:
        progress_data["streak_days"] = 1
        
    progress_data["last_activity_date"] = now.isoformat()


def get_student_profile(user_id: str):
    """Get student profile from Firestore"""
    doc = db.collection("users").document(user_id).get()
    if doc.exists:
        data = doc.to_dict()
        return data.get("profile")
    return None


def save_student_profile(user_id: str, profile: dict):
    """Save or update student profile in Firestore"""
    try:
        print(f"Saving to Firestore for user: {user_id}")
        db.collection("users").document(user_id).set({
            "profile": profile,
            "updated_at": datetime.utcnow()
        }, merge=True)
        print(f"Successfully saved to Firestore for user: {user_id}")
        return True
    except Exception as e:
        print(f"Firestore error for user {user_id}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise Exception(f"Database error: {str(e)}")

# backend/ai/tools.py

def check_isro_bhuvan_risk(lat: float, lng: float) -> dict:
    """
    Cross-references the victim's exact GPS coordinates with local topographical and flood data.
    Use this tool for every SOS payload to determine the environmental risk level.
    """
    # MVP Mock: In the final deployment, this will connect to the open ISRO/Bhuvan dataset.
    # For now, we simulate regional flood risk mapping based on coordinates.
    if lat > 18.0 and lng > 73.0: 
        return {
            "isro_flood_risk": "High", 
            "elevation_meters": 5, 
            "terrain_type": "Low-lying Flood Plain",
            "historical_flooding": True
        }
    
    return {
        "isro_flood_risk": "Low", 
        "elevation_meters": 45, 
        "terrain_type": "Elevated Plateau",
        "historical_flooding": False
    }

def evaluate_medical_urgency(payload: dict) -> dict:
    """
    Evaluates the medical urgency of an SOS. 
    Parses both the raw text message and the explicit boolean checklist flags.
    """
    message = payload.get("message", "").lower()
    
    # Extract the custom structured checklist boolean flags sent by the frontend
    medicine_flag = payload.get("medicine_required", False)
    injured_flag = payload.get("injured", False)
    
    # Fallback keyword scanning to handle critical conditions mentioned in the text
    critical_keywords = ["insulin", "oxygen", "bleeding", "unconscious", "heart", "fracture", "delivery"]
    found_keywords = [word for word in critical_keywords if word in message]
    
    # Calculate initial flags
    is_critical = medicine_flag or injured_flag or len(found_keywords) > 0
    
    return {
        "medical_critical": is_critical,
        "keywords_detected": found_keywords,
        "flags_active": {
            "medicine_required": medicine_flag,
            "injured": injured_flag
        }
    }
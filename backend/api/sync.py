from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import sqlite3
import os

router = APIRouter()
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "db", "database.db")

# Strict schema parsing for incoming P2P Bluetooth bundles
class SOSPayload(BaseModel):
    device_id: str
    name: str
    msg: str
    lat: float
    lng: float
    needs_food: bool
    needs_water: bool
    needs_clothes: bool
    needs_medicine: bool
    needs_powerbank: bool
    ts: int

@router.post("/api/sync")
async def sync_messages(payloads: List[SOSPayload]):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    inserted = 0
    skipped = 0

    for item in payloads:
        # Deduplication check against our indexing tree
        cursor.execute(
            "SELECT id FROM sos_messages WHERE device_id = ? AND timestamp = ?", 
            (item.device_id, item.ts)
        )
        if cursor.fetchone():
            skipped += 1
            continue 
        
        cursor.execute('''
            INSERT INTO sos_messages (
                device_id, name, message, lat, lng, 
                needs_food, needs_water, needs_clothes, needs_medicine, needs_powerbank, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            item.device_id, item.name, item.msg, item.lat, item.lng,
            item.needs_food, item.needs_water, item.needs_clothes, 
            item.needs_medicine, item.needs_powerbank, item.ts
        ))
        inserted += 1

    conn.commit()
    conn.close()

    return {"status": "success", "inserted": inserted, "skipped": skipped}
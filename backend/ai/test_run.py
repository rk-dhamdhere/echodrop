# backend/ai/test_run.py
from agent import triage_sos_payload

# Simulating a panicked, "fat-fingered" offline payload from the frontend
mock_payload = {
    "device_id": "uuid-9999",
    "lat": 18.5204, 
    "lng": 73.8567,
    "message": "water rapidlly rising. grandad needs insuln badlly!!",
    "medicine_required": True,
    "injured": False
}

print("Initiating EchoDrop AI Triage...")
print("-" * 40)

# Run the payload through your orchestrator
final_result = triage_sos_payload(mock_payload)

print("Triage Complete. Database Output:")
print(final_result)
print("-" * 40)
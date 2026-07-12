# backend/ai/agent.py
import os
import json
from backend.ai.tools import check_isro_bhuvan_risk, evaluate_medical_urgency
from dotenv import load_dotenv

from google import genai
from google.genai import types

load_dotenv()
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is missing from the .env file.")

client = genai.Client(api_key=api_key)

system_instruction = """
You are the MCP Orchestrator for the EchoDrop disaster triage system.
You receive raw SOS payloads from offline victims. 

MANDATORY RULES:
1. You MUST evaluate the payload using the provided tools.
2. RELY HEAVILY on the boolean flags (e.g., medicine_required, injured) over the raw text message.
3. You MUST output a strict JSON response with EXACTLY these two keys:
   - "ai_priority_score": Integer from 1 to 10.
   - "ai_triage_summary": A short, structured summary (max 10 words).
Do NOT output anything except the raw JSON dictionary.
"""

def triage_sos_payload(payload: dict) -> dict:
    """
    Forces Gemini to process the payload via tools and guarantees a valid DB-ready JSON return.
    """
    prompt = f"Triage this SOS payload: {json.dumps(payload)}"
    
    try:
        chat = client.chats.create(
            model='gemini-2.0-flash',
            config=types.GenerateContentConfig(
                tools=[check_isro_bhuvan_risk, evaluate_medical_urgency],
                system_instruction=system_instruction,
                temperature=0.1
            )
        )
        
        # 1. Send the initial payload
        response = chat.send_message(prompt)
        
        # 2. BULLETPROOF CATCH: If the SDK hangs on the tool call and returns None, force the text output.
        raw_text = response.text
        if not raw_text:
            response = chat.send_message("Execute the tools internally and output the final JSON dictionary now.")
            raw_text = response.text
            
        # 3. Clean and parse
        # Default to an empty JSON string if raw_text somehow is still None to prevent the crash
        safe_text = str(raw_text or "{}").replace('```json', '').replace('```', '').strip()
        result = json.loads(safe_text)
        
        return {
            "ai_priority_score": result.get("ai_priority_score", 5),
            "ai_triage_summary": result.get("ai_triage_summary", "Summary missing.")
        }
        
    except json.JSONDecodeError:
        print(f"Agent JSON Parse Error. Raw Output was: {raw_text}")
        return {"ai_priority_score": 1, "ai_triage_summary": "Triage failed: JSON formatting error."}
    except Exception as e:
        print(f"Agent processing failed: {e}")
        return {"ai_priority_score": 1, "ai_triage_summary": "Triage failed: System Error."}
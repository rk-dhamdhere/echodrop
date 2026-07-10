# echodrop
Offline-first disaster request mapping system for low-connectivity environments.
EchoDrop - Disaster Resilience System

EchoDrop is an offline-first disaster response platform designed to facilitate emergency request mapping in zero-connectivity environments. By utilizing a peer-to-peer "Data Mule" synchronization strategy and automated AI triage, it ensures rescue coordinators can prioritize and locate vulnerable populations without relying on cellular or internet infrastructure.

Project Structure

backend/: FastAPI implementation with MCP-enabled AI triage logic.

frontend/: Vanilla HTML5/JS frontend designed for PWA-caching in disaster zones.

Core Features

Offline Triage: Local SQLite database for disaster-proof storage.

Peer-to-Peer Sync: Bluetooth-based data muling for victim-to-rescuer data transfer.

AI Grounding: ISRO Bhuvan-grounded Gemini triage for emergency prioritization.

Offline Maps: Cached Leaflet.js tiles for basecamp coordination.

Getting Started

Navigate to /backend and install dependencies: pip install -r requirements.txt

Run the server: python main.py

Open frontend/index.html to initiate victim SOS mode.

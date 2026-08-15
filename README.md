EchoDrop 
Offline Disaster Resilience

HACK4HUMANITY 2026 | AI for Societal Good (Theme C: Disaster Relief)

Team: Project Akatsuki (Rishikesh Dhamdhere, Rohan Ayare, Sohan Darde, Tanmay Madhavi)


The Problem: During severe natural disasters (floods, cyclones, earthquakes), primary communication infrastructure like cell towers and internet lines are the first to fail. Displaced families and vulnerable populations are left isolated, unable to communicate their exact location or critical medical needs to rescue teams. Modern rescue applications often fail the common Indian citizen because they require active bandwidth or expensive hardware.

The Solution: EchoDrop is a purely offline-first disaster survival and coordination application. Designed specifically for low-cost hardware and zero-bandwidth environments, EchoDrop empowers local citizens to act as grassroots first responders. It bridges the communication gap by directly connecting stranded victims with nearby rescuers without relying on a single cell tower.
🛠 Tech Stack

EchoDrop is built to be lightweight, fast, and completely sustainable in offline conditions:

    Frontend: HTML5, CSS3 (Utilizing Dynamic Viewport 100dvh for seamless mobile scaling without clipping).

    Logic: Vanilla JavaScript (Zero external heavy frameworks to ensure instant load times).

    State Management: Native Browser LocalStorage (Ensures state and payload data survive device reboots/crashes).

    Backend / Edge Database: SQLite (Designed to securely log and query discovered victim payloads locally).

 Application Workflow

    Onboarding & Caching: Upon first launch, the user enters their details and the app locks onto their GPS coordinates. This data is instantly cached locally.

    Survival Grid (Always Available): Users have immediate offline access to disaster protocols, first-aid guides, and utility tools (like a camera-flash SOS and an audio oscillator whistle).

    Victim Mode ("I NEED HELP"): The user selects critical needs (Food, Water, Medicine) from a checklist. The app compiles this, alongside their cached GPS and device ID, into a structured JSON payload ready for offline broadcast.

    Mule Mode ("I CAN HELP"): Rescuers activate the scanning interface. The app listens for nearby offline distress beacons, allowing the rescuer to see who needs help and exactly what supplies they require.

Current Limitations & Incompletion (Transparency Disclosure)

In alignment with the HACK4HUMANITY mandate for honest documentation and real-world feasibility, we are disclosing the current prototype boundaries:

    Fully Complete: The mobile-responsive UI, offline caching mechanisms, utility tools, and the JSON GPS payload generation logic are 100% functional.

    Currently Simulated (Incomplete): The active Bluetooth Low Energy (BLE) / Wi-Fi Direct hardware bridging is simulated in this current prototype phase. While the frontend successfully generates the payload and the "Mule" UI actively scans, the physical peer-to-peer passing of the SQLite database between two distinct mobile devices requires native bridging (e.g., via a React Native/Flutter wrapper or Android Intents) which is slated for our post-hackathon deployment roadmap.

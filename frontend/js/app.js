document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('onboarding-overlay');
    const nameDisplay = document.getElementById('user-display-name');
    
    // Check if user has already done the one-time setup
    if (!localStorage.getItem('echoDrop_userName')) {
        overlay.classList.remove('hidden');
        setupOnboardingFlow();
    } else {
        overlay.classList.add('hidden');
        initApp();
    }

    function setupOnboardingFlow() {
        const btnSetup = document.getElementById('btn-complete-setup');
        const inputName = document.getElementById('setup-name');

        btnSetup.addEventListener('click', () => {
            let userName = inputName.value.trim();
            if (!userName) userName = "Survivor";

            const deviceId = crypto.randomUUID ? crypto.randomUUID() : 'id-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('echoDrop_deviceId', deviceId);
            localStorage.setItem('echoDrop_userName', userName);

            btnSetup.innerText = "Finding Location...";
            btnSetup.style.opacity = "0.7";

            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        localStorage.setItem('echoDrop_lastLat', position.coords.latitude);
                        localStorage.setItem('echoDrop_lastLng', position.coords.longitude);
                        alert("Setup complete. GPS locked.");
                        completeSetup();
                    },
                    (err) => {
                        console.warn("Location error:", err);
                        alert("Location access denied or failed, but you can still use offline features.");
                        completeSetup();
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            } else {
                alert("GPS not supported on this device.");
                completeSetup();
            }
        });
    }

    function completeSetup() {
        overlay.classList.add('hidden');
        initApp();
    }

// --- MAIN INITIALIZATION ---
    function initApp() {
        const savedName = localStorage.getItem('echoDrop_userName');
        if (nameDisplay) {
            nameDisplay.innerText = `Hello, ${savedName}`;
        }
        
        // Boot up all the sub-modules
        setupNavigation();
        setupTools();
        setupChecklist();
        setupTips();
        setupMuleMode(); // <--- ADD THIS LINE!
    }

    // --- 1. GUIDES NAVIGATION ---
    function setupNavigation() {
        const header = document.querySelector('.app-header');
        const grid = document.querySelector('.survival-grid');
        const actionZone = document.querySelector('.action-zone');
        const fabMap = document.getElementById('btn-map');
        
        const viewGuides = document.getElementById('view-guides');
        const btnGuides = document.getElementById('btn-guides');
        const btnBackGuides = document.getElementById('btn-back-guides');

        function toggleDashboard(show) {
            const displayStyle = show ? '' : 'none';
            header.style.display = displayStyle;
            grid.style.display = displayStyle;
            actionZone.style.display = displayStyle;
            fabMap.style.display = displayStyle;
        }

        btnGuides.addEventListener('click', () => {
            toggleDashboard(false);
            viewGuides.classList.remove('hidden');
        });

        btnBackGuides.addEventListener('click', () => {
            viewGuides.classList.add('hidden');
            toggleDashboard(true);
        });
    }

    // --- 2. EMERGENCY TOOLS ---
    function setupTools() {
        const viewTools = document.getElementById('view-tools');
        const btnTools = document.getElementById('btn-tools');
        const btnBackTools = document.getElementById('btn-back-tools');
        
        // Map toggle functions again for this scope
        const header = document.querySelector('.app-header');
        const grid = document.querySelector('.survival-grid');
        const actionZone = document.querySelector('.action-zone');
        const fabMap = document.getElementById('btn-map');
        
        function toggleDashboard(show) {
            const displayStyle = show ? '' : 'none';
            header.style.display = displayStyle;
            grid.style.display = displayStyle;
            actionZone.style.display = displayStyle;
            fabMap.style.display = displayStyle;
        }

        btnTools.addEventListener('click', () => {
            toggleDashboard(false);
            viewTools.classList.remove('hidden');
        });

        btnBackTools.addEventListener('click', () => {
            viewTools.classList.add('hidden');
            toggleDashboard(true);
        });

        const btnFlashlight = document.getElementById('toggle-flashlight');
        const btnWhistle = document.getElementById('toggle-whistle');
        
        let track = null;
        let flashlightOn = false;

        btnFlashlight.addEventListener('click', async () => {
            if (!flashlightOn) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                    track = stream.getVideoTracks()[0];
                    const capabilities = track.getCapabilities();
                    if (!capabilities.torch) {
                        alert("Torch is not supported on this device's browser.");
                        track.stop();
                        return;
                    }
                    await track.applyConstraints({ advanced: [{ torch: true }] });
                    flashlightOn = true;
                    btnFlashlight.classList.add('active-flashlight');
                    btnFlashlight.querySelector('span').innerText = "FLASHLIGHT ON";
                } catch (err) {
                    console.error("Flashlight error:", err);
                    alert("Could not access the camera for the flashlight.");
                }
            } else {
                if (track) track.stop();
                flashlightOn = false;
                btnFlashlight.classList.remove('active-flashlight');
                btnFlashlight.querySelector('span').innerText = "TURN ON FLASHLIGHT";
            }
        });

        let audioCtx = null;
        let oscillator = null;
        let isWhistling = false;

        btnWhistle.addEventListener('click', () => {
            if (!isWhistling) {
                if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                if (audioCtx.state === 'suspended') audioCtx.resume();
                
                oscillator = audioCtx.createOscillator();
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(3000, audioCtx.currentTime); 
                oscillator.connect(audioCtx.destination);
                oscillator.start();
                isWhistling = true;
                
                btnWhistle.classList.add('active-whistle');
                btnWhistle.querySelector('span').innerText = "STOP WHISTLE";
            } else {
                if (oscillator) {
                    oscillator.stop();
                    oscillator.disconnect();
                }
                isWhistling = false;
                btnWhistle.classList.remove('active-whistle');
                btnWhistle.querySelector('span').innerText = "SOUND WHISTLE";
            }
        });
    }

    // --- 3. CHECKLIST ---
    function setupChecklist() {
        const viewChecklist = document.getElementById('view-checklist');
        const btnChecklist = document.getElementById('btn-checklist');
        const btnBackChecklist = document.getElementById('btn-back-checklist');
        
        const header = document.querySelector('.app-header');
        const grid = document.querySelector('.survival-grid');
        const actionZone = document.querySelector('.action-zone');
        const fabMap = document.getElementById('btn-map');

        // --- Confirm Button Logic ---
        const btnConfirmChecklist = document.getElementById('btn-confirm-checklist');
        
        btnConfirmChecklist.addEventListener('click', () => {
            // Hides the checklist and returns to the main dashboard
            viewChecklist.classList.add('hidden');
            header.style.display = '';
            grid.style.display = '';
            actionZone.style.display = '';
            fabMap.style.display = 'flex';
        });
        
        btnChecklist.addEventListener('click', () => {
            header.style.display = 'none';
            grid.style.display = 'none';
            actionZone.style.display = 'none';
            fabMap.style.display = 'none';
            viewChecklist.classList.remove('hidden');
        });

        btnBackChecklist.addEventListener('click', () => {
            viewChecklist.classList.add('hidden');
            header.style.display = '';
            grid.style.display = '';
            actionZone.style.display = '';
            fabMap.style.display = 'flex';
        });

        const checkBtns = document.querySelectorAll('.check-btn');
        checkBtns.forEach(btn => {
            const itemKey = btn.getAttribute('data-item'); 
            if (localStorage.getItem(itemKey) === 'true') {
                btn.classList.add('selected');
            }
            btn.addEventListener('click', () => {
                btn.classList.toggle('selected');
                const isSelected = btn.classList.contains('selected');
                localStorage.setItem(itemKey, isSelected);
            });
        });
    }

    // --- 4. TIPS ---
    function setupTips() {
        const viewTips = document.getElementById('view-tips');
        const btnTips = document.getElementById('btn-tips');
        const btnBackTips = document.getElementById('btn-back-tips');
        
        const header = document.querySelector('.app-header');
        const grid = document.querySelector('.survival-grid');
        const actionZone = document.querySelector('.action-zone');
        const fabMap = document.getElementById('btn-map');

        btnTips.addEventListener('click', () => {
            header.style.display = 'none';
            grid.style.display = 'none';
            actionZone.style.display = 'none';
            fabMap.style.display = 'none';
            viewTips.classList.remove('hidden');
        });

        btnBackTips.addEventListener('click', () => {
            viewTips.classList.add('hidden');
            header.style.display = '';
            grid.style.display = '';
            actionZone.style.display = '';
            fabMap.style.display = 'flex';
        });
    }

    // --- MULE MODE (RESCUER SCANNING) ---
    function setupMuleMode() {
        const viewMuleActive = document.getElementById('view-mule-active');
        const btnMule = document.getElementById('btn-can-help'); // Main dashboard green button
        const btnStopMule = document.getElementById('btn-stop-mule');
        
        const header = document.querySelector('.app-header');
        const grid = document.querySelector('.survival-grid');
        const actionZone = document.querySelector('.action-zone');
        const fabMap = document.getElementById('btn-map');

        // Start Scanning
        btnMule.addEventListener('click', () => {
            header.style.display = 'none';
            grid.style.display = 'none';
            actionZone.style.display = 'none';
            fabMap.style.display = 'none';
            
            viewMuleActive.classList.remove('hidden');

            console.log("MULE MODE ACTIVE: Scanning for victim payloads via local backend...");
            // TODO: Trigger your backend/Bluetooth listening script here
        });

        // Stop Scanning
        btnStopMule.addEventListener('click', () => {
            viewMuleActive.classList.add('hidden');
            header.style.display = '';
            grid.style.display = '';
            actionZone.style.display = '';
            fabMap.style.display = 'flex';
            console.log("Scanning Stopped.");
        });
    }

});
document.addEventListener('DOMContentLoaded', () => {
    // Check if user has already done the one-time setup
    if (!localStorage.getItem('echoDrop_userName')) {
        performOnboarding();
    } else {
        // App is ready, show dashboard
        initApp();
    }
});

async function performOnboarding() {
    // 1. Ask for Name
    let userName = prompt("EchoDrop Setup: Please enter your name to continue.");
    if (!userName || userName.trim() === "") userName = "Survivor";

    // 2. Generate and Store Device ID
    const deviceId = crypto.randomUUID();
    localStorage.setItem('echoDrop_deviceId', deviceId);
    localStorage.setItem('echoDrop_userName', userName);

    // 3. Request Permissions (GPS, Bluetooth, Camera)
    try {
        // A. Request GPS Location
        await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        // B. Request Bluetooth Access
        // Note: This triggers the system browser permission dialog
        await navigator.bluetooth.requestDevice({
            acceptAllDevices: true
        });

        // C. Request Camera/Flashlight
        await navigator.mediaDevices.getUserMedia({ video: true });

        alert("Setup complete. You are ready to share your location.");
        initApp();
    } catch (err) {
        console.error("Permission denied or failed:", err);
        alert("Permissions are required for emergency features to function.");
    }
}

function initApp() {
    document.getElementById('user-display-name').innerText = `Hello, ${localStorage.getItem('echoDrop_userName')}`;
    // Load rest of your dashboard here
}
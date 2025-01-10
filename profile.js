import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAaJ8_qJrVVJnYlSdLQ1D5vaVRpS79GZ1E",
    authDomain: "kimii-horror.firebaseapp.com",
    projectId: "kimii-horror",
    storageBucket: "kimii-horror.firebasestorage.app",
    messagingSenderId: "425936807279",
    appId: "1:425936807279:web:35d001bc3eb90dd49ff49a",
    measurementId: "G-7KM8QRZTCR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// DOM Elements
const profileLink = document.getElementById("profileLink");
const dropdownCard = document.getElementById("dropdownCard");
const userNameDisplay = document.getElementById("userNameDisplay");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Toggle Dropdown Visibility
profileLink.addEventListener("click", (event) => {
    event.preventDefault();
    dropdownCard.style.display = dropdownCard.style.display === "none" ? "block" : "none";
});

// Handle Authentication State
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User logged in
        const displayName = user.displayName || user.email.split("@")[0];
        userNameDisplay.textContent = `Welcome, ${displayName}!`;

        // Show logout button and hide login button
        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";

        // Save user details to local storage
        const userDetails = {
            username: displayName,
            email: user.email,
            uid: user.uid
        };
        localStorage.setItem("loggedInUser", JSON.stringify(userDetails));
    } else {
        // User logged out
        userNameDisplay.textContent = "Welcome, Guest!";
        loginBtn.style.display = "block";
        logoutBtn.style.display = "none";

        // Clear user details from local storage
        localStorage.removeItem("loggedInUser");
    }
});

// Logout Functionality
logoutBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
        await signOut(auth);
        alert("Logged out successfully.");
    } catch (error) {
        console.error("Error during logout:", error);
    }
});

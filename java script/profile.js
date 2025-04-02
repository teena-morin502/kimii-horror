import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc, 
    deleteDoc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// 🔥 Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAaJ8_qJrVVJnYlSdLQ1D5vaVRpS79GZ1E",
    authDomain: "kimii-horror.firebaseapp.com",
    projectId: "kimii-horror",
    storageBucket: "kimii-horror.firebasestorage.app",
    messagingSenderId: "425936807279",
    appId: "1:425936807279:web:35d001bc3eb90dd49ff49a",
    measurementId: "G-7KM8QRZTCR"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🌟 DOM Elements
const profileLink = document.getElementById("profileLink");
const dropdownCard = document.getElementById("dropdownCard");
const userNameDisplay = document.getElementById("userNameDisplay");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

// 🎭 Toggle Profile Dropdown
profileLink.addEventListener("click", (event) => {
    event.preventDefault();
    dropdownCard.style.display = dropdownCard.style.display === "none" ? "block" : "none";
});

// ✅ Check Authentication State
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const displayName = user.displayName || user.email.split("@")[0];
        userNameDisplay.textContent = `Welcome, ${displayName}!`;

        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";

        // 📌 Check if user exists in Firestore
        const userRef = doc(db, "loggedInUsers", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            // 🚀 Add user to Firestore Collection
            await setDoc(userRef, {
                username: displayName,
                email: user.email,
                uid: user.uid,
                loginTime: new Date().toISOString()
            });
        }

        // ✅ Allow access to Subscription Page
        if (window.location.pathname.includes("subscription.html")) {
            console.log("✅ User allowed on Subscription Page.");
        }
    } else {
        userNameDisplay.textContent = "Welcome, Guest!";
        loginBtn.style.display = "block";
        logoutBtn.style.display = "none";

        // 🚫 Redirect to Login if accessing Subscription Page
        if (window.location.pathname.includes("subscription.html")) {
            console.log("❌ User not logged in! Redirecting...");
            window.location.href = "login.html";
        }
    }
});

logoutBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const user = auth.currentUser;

    if (user) {
        try {
            // 🗑 Remove user from Firestore
            await deleteDoc(doc(db, "loggedInUsers", user.uid));
            await signOut(auth);
            showAlert("Logged out successfully.", "", "success", () => {
                window.location.href = "./../html/login.html"; // Redirect to login page after confirmation
            });
        } catch (error) {
            console.error("❌ Error during logout:", error);
        }
    }
});

// Show Alert Function (Reused from Details Page)
function showAlert(title, text, icon, callback = null) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonColor: "#D10000",
        background: "#111",
        color: "#fff",
        confirmButtonText: "OK",
    }).then(() => {
        if (callback) callback();
    });
}

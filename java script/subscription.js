//  Import Firebase Modules
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
    getDoc, 
    deleteDoc 
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

//  Check If User is Logged In and Exists in Firestore
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const loggedUserRef = doc(db, "loggedInUsers", user.uid);
        const loggedUserSnap = await getDoc(loggedUserRef);

        if (loggedUserSnap.exists()) {
            console.log(" User exists in Firestore, checking subscription...");

            // 🔍 Check if user is already subscribed
            const subRef = doc(db, "subscribedUsers", user.uid);
            const subSnap = await getDoc(subRef);

            if (subSnap.exists()) {
                const subscriptionData = subSnap.data();
                checkSubscriptionStatus(user, subscriptionData);
            } else {
                console.log("User not subscribed yet, subscribing now...");
                subscribe(user);
            }
        } else {
            console.log("User not found in Firestore! Redirecting...");
            window.location.href = "login.html";
        }
    } else {
        console.log("No user logged in! Redirecting...");
        window.location.href = "login.html";
    }
});

//  Subscribe Function
async function subscribe(user) {
    const subscriptionId = `SUB-${Date.now()}`;
    const subscriptionDate = new Date();
    const validityDays = 30; // Default 1-month subscription
    const expiryDate = new Date(subscriptionDate);
    expiryDate.setDate(subscriptionDate.getDate() + validityDays);

    const subscriptionData = {
        userId: user.uid,
        userEmail: user.email,
        subscriptionId: subscriptionId,
        subscriptionDate: subscriptionDate.toISOString().split("T")[0],
        planValidity: "1 Month",
        expiryDate: expiryDate.toISOString().split("T")[0]
    };

    try {
        await setDoc(doc(db, "subscribedUsers", user.uid), subscriptionData);
        console.log(" Subscription added to Firestore.");
        checkSubscriptionStatus(user, subscriptionData);
    } catch (error) {
        console.error("Error during subscription:", error);
    }
}

//  Check Subscription Status
async function checkSubscriptionStatus(user, data) {
    const currentDate = new Date();
    const expiryDate = new Date(data.expiryDate);

    if (currentDate > expiryDate) {
        await deleteDoc(doc(db, "subscribedUsers", user.uid));
        showAlert("Your subscription has expired. Please subscribe again.");
        console.log("Subscription expired. Redirecting...");
        window.location.href = "subscribe.html";
    } else {
        showThankYouMessage();
    }
}

//  Show "Thank You for Subscribing" Message
function showThankYouMessage() {
    document.body.innerHTML = `
        <div style="
            position: fixed; 
            top: 50%; left: 50%; 
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ff5559, #550000);
            padding: 30px; 
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
            color: white; text-align: center; font-size: 18px;">
            <h2>🎉 Thank You for Subscribing! 🎉</h2>
            <p>Your subscription is now active.</p>
        </div>`;

    setTimeout(() => {
        window.location.href = "index.html"; 
    }, 3000);
}

//  Logout Function
window.logout = async function () {
    const user = auth.currentUser;
    if (user) {
        try {
            await deleteDoc(doc(db, "loggedInUsers", user.uid));
            console.log(" User removed from Firestore loggedInUsers.");
            
            await deleteDoc(doc(db, "subscribedUsers", user.uid));
            console.log(" User removed from Firestore subscribedUsers.");
            
            await signOut(auth);
            showAlert("Logged out successfully.");
            window.location.href = "login.html";
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }
};

//  Subscription Button Event
document.addEventListener("DOMContentLoaded", async () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const subRef = doc(db, "subscribedUsers", user.uid);
            const subSnap = await getDoc(subRef);

            if (subSnap.exists()) {
                showAlert("🎉 You are already subscribed! Thank you.");
                window.location.href = "./../html/index.html";
            }
        }
    });

    const subscribeBtn = document.getElementById("subscribeBtn");
    if (subscribeBtn) {
        subscribeBtn.addEventListener("click", async () => {
            if (!auth.currentUser) {
                showAlert("You need to log in first!");
                window.location.href = "./../html/login.html";
                return;
            }
            await subscribe(auth.currentUser);
        });
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

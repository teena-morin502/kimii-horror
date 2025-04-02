// Firebase Configuration
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
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const form = document.getElementById("loginPage");
const email = document.getElementById("email");
const emailError = document.getElementById("emailError");
const password = document.getElementById("password");
const passwordError = document.getElementById("passwordError");
const showPasswordToggle = document.getElementById("show-password-toggle");
let failedAttempts = 0; // Counter for failed attempts

// Toggle Password Visibility
showPasswordToggle.addEventListener("click", () => {
  const isPasswordVisible = password.getAttribute("type") === "password";
  password.setAttribute("type", isPasswordVisible ? "text" : "password");
  showPasswordToggle.textContent = isPasswordVisible ? "Hide" : "Show";
});

// Form Submission
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form submission

  // Clear previous error messages

  emailError.textContent = "";
  passwordError.textContent = "";
  emailError.style.display = "none";
  passwordError.style.display = "none";
  let isValid = true; // Validation flag

// Validate Email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
if (!email.value) {
    emailError.textContent = "Email is required!";
    emailError.style.display = "block";
    emailError.style.color = "red";
    isValid = false;
  } else if (email.value.includes(" ")) {
    emailError.textContent = "Email should not contain spaces!";
    emailError.style.display = "block";
    emailError.style.color = "red";
    isValid = false;
  }  else if (email.value.length > 200) {
    emailError.textContent = "Email is too long! Maximum 200 characters allowed.";
    emailError.style.display = "block";
    emailError.style.color = "red";
    isValid = false;
   } else if (!emailRegex.test(email.value)) {
    emailError.textContent = "Please enter a valid email address!";
    emailError.style.display = "block";
    emailError.style.color = "red";
    isValid = false;
  } else if (!email.value.endsWith("@gmail.com")) {
    emailError.textContent = "Only @gmail.com email addresses are allowed!";
    emailError.style.display = "block";
    emailError.style.color = "red";
    isValid = false;
  }

  // Validate Password
  if (!password.value) {
    passwordError.textContent = "Password is required!";
    passwordError.style.display = "block";
    passwordError.style.color = "red";
    isValid = false;
  } else if (password.value.length < 7 || password.value.length > 15) {
    passwordError.textContent = "Password must be 7-15 characters long!";
    passwordError.style.display = "block";
    passwordError.style.color = "red";
    isValid = false;
 } else if (!/[A-Z]/.test(password.value)) {
  passwordError.textContent = "Password must include at least one uppercase letter!";
  passwordError.style.display = "block";
  passwordError.style.color = "red";
  isValid = false;
} else if (!/[a-z]/.test(password.value)) {
  passwordError.textContent = "Password must include at least one lowercase letter!";
  passwordError.style.display = "block";
  passwordError.style.color = "red";
  isValid = false;
} else if (!/[0-9]/.test(password.value)) {
  passwordError.textContent = "Password must include at least one number!";
  passwordError.style.display = "block";
  passwordError.style.color = "red";
  isValid = false;
} else if (!/[\W_]/.test(password.value)) {
  passwordError.textContent = "Password must include at least one special character!";
  passwordError.style.display = "block";
  passwordError.style.color = "red";
  isValid = false;
}

  // Handle Firebase Authentication
  if (isValid) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
      showAlert("Login successful!");
      window.location.href = "index.html"; // Redirect to homepage
    } catch (error) {
      // Increment failed attempts counter
    failedAttempts++;

      // Handle Firebase authentication errors
      if (error.code === "auth/-not-found") {
        emailError.textContent = "The given email is not found.";
        emailError.style.display = "block";
        emailError.style.color = "red";
      } else if (error.code === "auth/wrong-password") {
        passwordError.textContent = "The password is incorrect.";
        passwordError.style.display = "block";
        passwordError.style.color = "red";
      } else {
        console.error("Error:", error);
        showAlert("Account not recognized or wrong password entered.");
      }

      // Alert after 3 failed attempts
      if (failedAttempts >= 10) {
        showAlert("Please try later.");
        failedAttempts = 0; // Reset the counter
      }
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
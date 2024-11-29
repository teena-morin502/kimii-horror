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

// Select form elements
// Get references to DOM elements
const form = document.getElementById("Sign-up");
const username = document.getElementById("name");
const usernameError = document.getElementById("nameError");
const email = document.getElementById("email");


// dom elements
const emailError = document.getElementById("emailError");
const password = document.getElementById("password");
const passwordError = document.getElementById("passwordError");
const confirmPassword = document.getElementById("confirmPassword");
const confirmPasswordError = document.getElementById("confirmPasswordError");


// Password visibility toggle
document.querySelectorAll(".see-password").forEach((toggleWrapper, index) => {
  const toggleButton = toggleWrapper.querySelector("#show-password-toggle");
  const targetPassword = index === 0 ? password : confirmPassword;

  toggleButton.addEventListener("click", () => {
    const isPasswordVisible = targetPassword.getAttribute("type") === "password";
    targetPassword.setAttribute("type", isPasswordVisible ? "text" : "password");
    toggleButton.textContent = isPasswordVisible ? "Hide" : "Show";
  });
});

// Form submission event listener
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent default form submission

  // Clear previous error messages
  usernameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";

  let isValid = true; // A flag to check form validity

  // Validate username
  if (!username.value) {
    usernameError.textContent = "Username is required!";
    usernameError.style.color = "red";
    isValid = false;
} else if (/^\d+$/.test(username.value)) {
    usernameError.textContent = "Username cannot consist of only numbers!";
    usernameError.style.color = "red";
    isValid = false;
}else if (username.value.startsWith(" ")) {
  usernameError.textContent = "Username cannot start with a space!"; // Show error for leading spaces
  usernameError.style.color = "red";
  isValid = false;
}  else if (username.value.length < 3) {
    usernameError.textContent = "Username must be at least 4 characters long!";
    usernameError.style.color = "red";

    isValid = false;
  }

  // Validate email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!email.value) {
    emailError.textContent = "Email is required!";
    emailError.style.color = "red";
    isValid = false;
  } else if (email.value.includes(" ")) {
    emailError.textContent = "Email should not contain spaces!";
    emailError.style.color = "red";
    isValid = false;
  }  else if (email.value.length > 200) {
    emailError.textContent = "Email is too long! Maximum 200 characters allowed.";
    emailError.style.color = "red";
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    emailError.textContent = "Please enter a valid email address!";
    emailError.style.color = "red";
    isValid = false;
  } else if (!email.value.endsWith("@gmail.com")) {
    emailError.textContent = "Only @gmail.com email addresses are allowed!";
    emailError.style.color = "red";
    isValid = false;
  }

  // Validate password
  if (!password.value) {
    passwordError.textContent = "Password is required!";
    passwordError.style.color = "red";
    isValid = false;
  } else if (password.value.length < 7 || password.value.length > 15) {
    passwordError.textContent = "Password must be 7-15 characters long!";
    passwordError.style.color = "red";
    isValid = false;
  } else if (!/[A-Z]/.test(password.value)) {
    passwordError.textContent = "Password must include at least one uppercase letter!";
    passwordError.style.color = "red";
    isValid = false;
  } else if (!/[a-z]/.test(password.value)) {
    passwordError.textContent = "Password must include at least one lowercase letter!";
    passwordError.style.color = "red";
    isValid = false;
  } else if (!/[0-9]/.test(password.value)) {
    passwordError.textContent = "Password must include at least one number!";
    passwordError.style.color = "red";
    isValid = false;
  } else if (!/[\W_]/.test(password.value)) {
    passwordError.textContent = "Password must include at least one special character!";
    passwordError.style.color = "red";
    isValid = false;
  }
  

  // Validate confirm password
  if (!confirmPassword.value) {
    confirmPasswordError.textContent = "Confirm Password is required!";
    confirmPasswordError.style.color = "red";
    isValid = false;
  } else if (confirmPassword.value !== password.value) {
    confirmPasswordError.textContent = "Passwords do not match!";
    confirmPasswordError.style.color = "red";
    isValid = false;
  }


  if (isValid) {
    try {
      // Check if email is already registered
      const userDocRef = doc(db, "users", email.value);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        emailError.textContent = "Email is already in use!";
        emailError.style.color = "red";
        return;
      }

      // Create user in Firebase Auth
      await createUserWithEmailAndPassword(auth, email.value, password.value);

      // Save user to Firestore
      await setDoc(userDocRef, {
        username: username.value,
        email: email.value,
      });

      alert("Signup successful!");
      window.location.href = "index-home.html"; // Redirect to login
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  }
});
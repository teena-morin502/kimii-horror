// // Import the functions you need from the SDKs
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAaJ8_qJrVVJnYlSdLQ1D5vaVRpS79GZ1E",
//   authDomain: "kimii-horror.firebaseapp.com",
//   projectId: "kimii-horror",
//   storageBucket: "kimii-horror.appspot.com",
//   messagingSenderId: "425936807279",
//   appId: "1:425936807279:web:35d001bc3eb90dd49ff49a",
//   measurementId: "G-7KM8QRZTCR",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Select form elements
// Get references to DOM elements
const form = document.getElementById("Sign-up");
const username = document.getElementById("name");
const usernameError = document.getElementById("nameError");
const email = document.getElementById("email");
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
form.addEventListener("submit", (event) => {
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
  } else if (username.value.length < 4) {
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
  } else if (!emailRegex.test(email.value)) {
    emailError.textContent = "Please enter a valid email address!";
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

  // If the form is valid, simulate successful account creation
  if (isValid) {
    alert("Account created successfully!");
    form.reset(); // Reset the form
  }
});

// Real-time username validation
username.addEventListener("input", () => {
  if (username.value.length >= 4) {
    usernameError.textContent = "";
  }
});

// Real-time email validation
email.addEventListener("input", () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(email.value)) {
    emailError.textContent = "";
  }
});

// Real-time password validation
password.addEventListener("input", () => {
  if (password.value.length >= 7 && password.value.length <= 15) {
    passwordError.textContent = "";
  }
});

// Real-time confirm password validation
confirmPassword.addEventListener("input", () => {
  if (confirmPassword.value === password.value) {
    confirmPasswordError.textContent = "";
  }
});

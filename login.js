// Get references to DOM elements
const form = document.getElementById("loginPage");
const email = document.getElementById("email");
const emailError = document.getElementById("emailError");
const password = document.getElementById("password");
const passwordError = document.getElementById("passwordError");

// Create and add a toggle button for password visibility
const showPasswordToggle = document.getElementById("show-password-toggle");
const passwordField = document.getElementById("password");
// Toggle password visibility
showPasswordToggle.addEventListener("click", () => {
  const isPasswordVisible = passwordField.getAttribute("type") === "password";
  passwordField.setAttribute("type", isPasswordVisible ? "text" : "password");
  showPasswordToggle.textContent = isPasswordVisible ? "Hide" : "Show";
});

// Form submission event listener
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission

  // Clear any previous error messages
  emailError.textContent = "";
  passwordError.textContent = "";
  emailError.style.display = "none";
  passwordError.style.display = "none";

  let isValid = true; // A flag to check form validity

  // Validate email
  if (!email.value){
    emailError.textContent = "Email is required!";
    emailError.style.display = "block";
    isValid = false;
  } else if (!email.value.endsWith("@gmail.com")) {
    emailError.textContent = "Only @gmail.com email addresses are allowed!";
    emailError.style.display = "block";
    isValid = false;
  }

  // Validate password
  if (!password.value) {
    passwordError.textContent = "Password is required!";
    passwordError.style.display = "block";
    isValid = false;
  } else if (password.value.length < 7 || password.value.length > 15) {
    passwordError.textContent = "Password must be 7-15 characters long!";
    passwordError.style.display = "block";
    isValid = false;
  }

  // If the form is valid, proceed with login
  if (isValid) {
    alert("Login successful!");
    window.location.href = "index.html"; // Redirect to your desired page
  }
});

// Email input validation with real-time feedback
email.addEventListener("input", function() {
  emailError.textContent = "";
  emailError.style.display = "none";
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!gmailRegex.test(email.value)) {
    emailError.textContent = "Please enter a valid @gmail.com email address!";
    emailError.style.display = "block";
  }
});

// Password input validation with real-time feedback
password.addEventListener("input", function() {
  passwordError.textContent = "";
  passwordError.style.display = "none";
  if (password.value.length < 7 || password.value.length > 15) {
    passwordError.textContent = "Password must be 7-15 characters long!";
    passwordError.style.display = "block";
  }
});

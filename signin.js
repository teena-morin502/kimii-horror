const form = document.getElementById("Sign-up");
const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const conformPassword = document.getElementById("conformPassword");
const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const conformPasswordError = document.getElementById("conformPasswordError");
const btn = document.querySelector("button[type='submit']");
const showPasswordToggle = document.getElementById("show-password-toggle");
const passwordField = document.getElementById("password");

showPasswordToggle.addEventListener("click", () => {
  // Toggle the password visibility
  const isPasswordVisible = passwordField.getAttribute("type") === "password";
  passwordField.setAttribute("type", isPasswordVisible ? "text" : "password");
  // Update the toggle text
  showPasswordToggle.textContent = isPasswordVisible ? "Hide" : "Show";
});
const showConformPasswordToggle = document.getElementById("show-conformPassword-toggle");
const conformPasswordField = document.getElementById("conformPassword");
showConformPasswordToggle.addEventListener("click", () => {
  // Toggle the password visibility
  const isConformPasswordVisible = conformPasswordField.getAttribute("type") === "password";
  conformPasswordField.setAttribute("type", isConformPasswordVisible ? "text" : "password");
  // Update the toggle text
  showConformPasswordToggle.textContent = isConformPasswordVisible ? "Hide" : "Show";
});
form.addEventListener("submit", function(event) {
  event.preventDefault();
  // Clear previous error messages
  nameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  conformPasswordError.textContent = "";
  let isValid = true;
  // Name validation
  if (!name.checkValidity()) {
    if (name.validity.valueMissing) {
      nameError.textContent = "Name is required!";
    } else if (name.value.length < 4) {
      nameError.textContent = "Name must be at least 4 characters long!";
    }
    isValid = false;
  }
  // Basic validation for email format and password length
  if (!email.value.endsWith("@gmail.com")) {
    emailError.textContent = "Only @gmail.com email addresses are allowed!";
    isValid = false;
  }
  // Email validation
  if (!email.checkValidity()) {
    if (email.validity.valueMissing) {
      emailError.textContent = "Email is required!";
    } else if (email.validity.typeMismatch) {
      emailError.textContent = "Please enter a valid email address!";
    }
    isValid = false;
  }
  // Password validation
  if (!password.checkValidity()) {
    if (password.validity.valueMissing) {
      passwordError.textContent = "Password is required!";
    } else if (password.value.length < 7 || password.value.length > 15) {
      passwordError.textContent = "Password must be 7-15 characters long!";
    }
    isValid = false;
  }
  // Confirm password validation
  if (password.value !== conformPassword.value) {
    conformPasswordError.textContent = "Passwords do not match!";
    isValid = false;
  }
});
name.addEventListener("input", function() {
   nameError.textContent="";
   if(name.value.length<4){
    nameError.textContent = "Name must be at least 4 characters long!";
   }
   else{
    nameError.textContent="";
   }
});
email.addEventListener("input", function() {
  emailError.textContent = "";
  // Regular expression for a valid Gmail address
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  // Check if the email matches the regex pattern
  if (!gmailRegex.test(email.value)) {
    emailError.textContent = "Please enter a valid @gmail.com email address!";
  } else {
    emailError.textContent = ""; // Clear the error if the email is valid
  }
});
password.addEventListener("input", function() {
  passwordError.textContent = "";
  // Check if the passwords match
  if (password.value.length < 7 || password.value.length > 15 ) {
    passwordError.textContent = `Password must be at least ${password.minLength} characters`;
  } else {
    passwordError.textContent = ""; // Clear the error if passwords match
  }
});
conformPassword.addEventListener("input", function() {
  conformPasswordError.textContent = "";
  // Check if the passwords match
  if (conformPassword.value !== password.value) {
    conformPasswordError.textContent = "Passwords do not match!";
  } else {
    conformPasswordError.textContent = ""; // Clear the error if passwords match
  }
});










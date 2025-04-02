import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaJ8_qJrVVJnYlSdLQ1D5vaVRpS79GZ1E",
  authDomain: "kimii-horror.firebaseapp.com",
  projectId: "kimii-horror",
  storageBucket: "kimii-horror.appspot.com",
  messagingSenderId: "425936807279",
  appId: "1:425936807279:web:35d001bc3eb90dd49ff49a",
  measurementId: "G-7KM8QRZTCR",
};

// ✅ Prevent Multiple Firebase Initializations
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const wishlistContainer = document.getElementById("wishlistContainer");
const loginMessage = document.getElementById("loginMessage");

let userId = null;

// ✅ Check if the user is logged in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userId = user.uid;
    console.log("✅ User logged in:", userId);
    loginMessage.style.display = "none";
    wishlistContainer.style.display = "block";
    await loadWishlist();
  } else {
    console.warn("⚠️ No user signed in.");
    wishlistContainer.style.display = "none";
    loginMessage.style.display = "block";
  }
});

// ✅ Fetch wishlist movies from Firebase
async function loadWishlist() {
  if (!userId) return;

  try {
    console.log("⏳ Fetching wishlist...");
    const wishlistRef = collection(db, "wishlist");
    const q = query(wishlistRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    wishlistContainer.innerHTML = "";

    if (querySnapshot.empty) {
      wishlistContainer.innerHTML = "<p>Your wishlist is empty. Start adding movies!</p>";
      return;
    }

    querySnapshot.forEach((docSnap) => {
      let movie = docSnap.data();
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");

      movieCard.innerHTML = `
        <div class="movie-card-content">
          <img src="${movie.image_url}" alt="${movie.movie_name}" class="movie-image" data-id="${movie.id}">
          <h3>${movie.movie_name}</h3>
          <p>⭐ ${movie.rating || "N/A"}</p>
          <button class="remove-button" data-id="${movie.id}">❌ Remove</button>
        </div>
      `;

      wishlistContainer.appendChild(movieCard);
    });

    // ✅ Attach event listeners
    document.querySelectorAll(".remove-button").forEach((button) => {
      button.addEventListener("click", removeFromWishlist);
    });

    document.querySelectorAll(".movie-image").forEach((image) => {
      image.addEventListener("click", (event) => {
        const movieId = event.target.getAttribute("data-id");
        window.location.href = `details.html?id=${movieId}`;
      });
    });

    console.log("✅ Wishlist loaded.");
  } catch (error) {
    console.error("❌ Error fetching wishlist:", error);
  }
}

// ✅ Remove movie from wishlist
async function removeFromWishlist(event) {
  const movieId = event.target.getAttribute("data-id");
  if (!userId) return;

  try {
    console.log(`⏳ Removing movie ${movieId} from wishlist...`);
    const wishlistRef = doc(db, "wishlist", `${userId}_${movieId}`);
    await deleteDoc(wishlistRef);
    showAlert("Movie removed from wishlist!");
    await loadWishlist(); // Refresh wishlist
  } catch (error) {
    console.error("❌ Error removing movie:", error);
  }
}

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
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

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

// ✅ DOM Elements
const searchInput = document.getElementById("filter");
const resultContainer = document.getElementById("result-container");

resultContainer.style.display = "none";

// ✅ Load Movies from Firestore
async function loadMoviesData() {
  try {
    const moviesSnapshot = await getDocs(collection(db, "movies"));
    let movies = [];

    moviesSnapshot.forEach((doc) => {
      let movieData = doc.data();
      movieData.id = doc.id; // 🔥 Store Firebase document ID
      movies.push(movieData);
    });

    return movies;
  } catch (error) {
    console.error("❌ Error loading movies:", error);
    return [];
  }
}

// ✅ Filter Movies Based on Search Input
async function filterMovies() {
  const movies = await loadMoviesData();
  const searchTerm = searchInput.value.toLowerCase();
  resultContainer.innerHTML = "";

  if (searchTerm.trim() === "") {
    resultContainer.style.display = "none";
    return;
  }

  const filteredMovies = movies.filter((movie) => {
    const movieName = movie.movie_name?.toLowerCase() || "";
    const genres = movie.genre?.map(g => g.toLowerCase()) || [];

    return movieName.includes(searchTerm) || genres.some((g) => g.includes(searchTerm));
  });

  if (filteredMovies.length > 0) {
    filteredMovies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
      const releaseYear = movie.details?.year || "N/A";

      movieCard.innerHTML = `
        <img src="${movie.image_url || 'default-image.jpg'}" alt="${movie.movie_name}" width="100" height="150">
        <div>
          <h3>${movie.movie_name}</h3>
          <p>${releaseYear}</p>
          <p>Rating: ${movie.rating || 'N/A'}</p>
        </div>
      `;

      // ✅ On Click, Redirect to Movie Details Page with Firebase ID
      movieCard.addEventListener("click", () => {
        window.location.href = `./../html/details.html?id=${movie.id}`;
      });

      resultContainer.appendChild(movieCard);
    });

    resultContainer.style.display = "block";
  } else {
    resultContainer.innerHTML = `<p>No matches found for "${searchTerm}"</p>`;
    resultContainer.style.display = "block";
  }
}

// ✅ Add Input Event Listener to Search Box
searchInput.addEventListener("input", filterMovies);

// ✅ Hide Result Container When Clicking Outside
document.addEventListener("click", (event) => {
  if (!resultContainer.contains(event.target) && !searchInput.contains(event.target)) {
    resultContainer.innerHTML = "";
    resultContainer.style.display = "none";
  }
});

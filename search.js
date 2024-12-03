// Import Firebase dependencies
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAaJ8_qJrVVJnYlSdLQ1D5vaVRpS79GZ1E",
  authDomain: "kimii-horror.firebaseapp.com",
  projectId: "kimii-horror",
  storageBucket: "kimii-horror.firebasestorage.app",
  messagingSenderId: "425936807279",
  appId: "1:425936807279:web:35d001bc3eb90dd49ff49a",
  measurementId: "G-7KM8QRZTCR"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// *Dynamic Search Movies Function*
async function searchMovies(searchQuery) {
  const collectionsToSearch = [
    "top_10MoviesContainer", 
    "thrillerMoviesContainer", 
    "real_horrorMovieContainer", 
    "real_storiesMovieContainer"
  ];
  const results = [];

  for (const collectionName of collectionsToSearch) {
    const snapshot = await getDocs(collection(db, collectionName));
    snapshot.forEach((doc) => {
      const movie = doc.data();
      if (movie.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ ...movie, collectionName });
      }
    });
  }
  return results;
}

// *Dynamic Render Function*
function renderMovies(results) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";  // Clear previous results

  if (results.length === 0) {
    resultsDiv.innerHTML = "<p>No movies found matching your query.</p>";
    return;
  }

  results.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
      <img src="${movie.image_url}" alt="${movie.movie_name}" class="movie-poster">
      <h3>${movie.movie_name}</h3>
      <p><strong>Genre:</strong> ${movie.genre || "N/A"}</p>
      <a href="${movie.videolink}" target="_self" class="btn">Watch Trailer</a>
    `;
    resultsDiv.appendChild(movieCard);
  });
}

// *Main Search Function (Triggered on Input)*
async function displaySearchResults() {
  const searchQuery = document.getElementById("filter").value.trim();  // Get search query from filter input
  const displaySection = document.getElementById("display");

  if (!searchQuery) {
    displaySection.style.display = "none"; // Hide results when search is empty
    return;
  }

  displaySection.style.display = "block"; // Show results section when user starts typing
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>Loading...</p>";  // Show loading message while fetching results

  try {
    const results = await searchMovies(searchQuery);
    renderMovies(results);
  } catch (error) {
    console.error("Error searching movies:", error);
    resultsDiv.innerHTML = "<p>Error fetching results. Please try again later.</p>";
  }
}

// *Search Event Listener*
document.getElementById("filter").addEventListener("input", displaySearchResults);

// *Optional: Trigger Search on Page Load if Query Exists in URL (For deep linking purposes)*
document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("query");

  if (query) {
    document.getElementById("filter").value = query;
    displaySearchResults();
  }
});

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAaJ8_qJrVVJnYlSdLQ1D5vaVRpS79GZ1E",
  authDomain: "kimii-horror.firebaseapp.com",
  projectId: "kimii-horror",
  storageBucket: "kimii-horror.appspot.com",
  messagingSenderId: "425936807279",
  appId: "1:425936807279:web:35d001bc3eb90dd49ff49a",
  measurementId: "G-7KM8QRZTCR",
};

// Prevent Multiple Firebase Initializations
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

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

// Load Video Page Content
async function loadVideoContent() {
    const videoContainer = document.getElementById("video-container");
    const movieDescription = document.getElementById("movie-description"); 
    if (!videoContainer || !movieDescription) {
        console.error(" Error: Required containers not found.");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");

    console.log(" Extracted Movie ID:", movieId);

    if (!movieId) {
        showAlert("No Movie Selected", "Please go back and select a movie.", "warning");
        return;
    }

    try {
        const docRef = doc(db, "movies", movieId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            showAlert("Movie Not Found", "The selected movie does not exist.", "error");
            return;
        }

        const movie = docSnap.data();
        movie.id = movieId;
        const videoUrl = movie.details?.video_url || "";

        if (!videoUrl) {
            showAlert("Video Not Available", "This movie does not have a valid video URL.", "error");
            return;
        }

        const embedUrl = videoUrl.replace("watch?v=", "embed/");

        videoContainer.innerHTML = `
        <div class="movie-title">
            <h2>${movie.movie_name}</h2>
        </div>
        <div class="video-player">
            <iframe width="100%" height="500px" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>
        </div>

        `;

        // Load Movie Description
        movieDescription.innerHTML = `
            <h2>Description</h2>
            <p style="margin-left:30px; "margin-right:30px; font-size:20px">${movie.description || "No description available."}</p>
        `;

        loadRecommendedMovies(movieId);
    } catch (error) {
        console.error(" Error loading video content:", error);
        showAlert("Error Loading Video", "An error occurred while loading the movie.", "error");
    }
}

// 🎥 Load Recommended Movies
async function loadRecommendedMovies(currentMovieId) {
    const recommendedContainer = document.getElementById("recommended-grid");
    if (!recommendedContainer) {
        console.error(" Error: Recommended movies container not found.");
        return;
    }

    try {
        console.log("Fetching recommended movies...");
        const moviesRef = collection(db, "movies");
        const querySnapshot = await getDocs(moviesRef);

        let movies = [];
        querySnapshot.forEach((docSnap) => {
            if (docSnap.id !== currentMovieId) {
                let movie = docSnap.data();
                movie.id = docSnap.id;
                movies.push(movie);
            }
        });

        // Select up to 5 recommended movies
        movies = movies.sort(() => Math.random() - 0.5).slice(0, 5);

        // Generate Recommended Movies Section
        recommendedContainer.innerHTML = movies.map(movie => `
            <div class="movie_slide">
               <a href="details.html?id=${movie.id}">
                    <img src="${movie.image_url}" alt="${movie.movie_name}" width="200" height="300">
                </a>
            </div>
        `).join("");

        console.log("Recommended movies loaded successfully.");
    } catch (error) {
        console.error(" Error loading recommended movies:", error);
        showAlert("Error Loading Recommendations", "Could not load recommended movies.", "error");
    }
}

// 🚀 Load video content when the page loads
document.addEventListener("DOMContentLoaded", () => {
    loadVideoContent();
});

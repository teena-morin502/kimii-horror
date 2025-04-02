// Import Firebase
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

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
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🎬 Load Movie Details
async function loadMovieDetails() {
    const detailsContainer = document.getElementById("movie-details");
    if (!detailsContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get("id");

    if (!movieId) {
        showAlert("No movie selected", "Please select a movie to view details.", "warning");
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
        const trailerEmbedUrl = movie.details?.video_url?.replace("watch?v=", "embed/") || "";

        detailsContainer.innerHTML = `
        <div class="movie_name">
            <h1>${movie.movie_name}</h1>
            <div class="movie-meta">
                <span>${movie.details?.year || "Unknown"}</span>
                <span>${movie.rating || "N/A"}/5</span>
            </div>
        </div>
        <div class="movie-details-container">
            <div class="movie-poster">
                <img src="${movie.image_url}" alt="${movie.movie_name}" width="300" height="420">
            </div>
            <div class="movie-info">
                <iframe width="800" height="350" src="${trailerEmbedUrl}" frameborder="0" allowfullscreen></iframe>
                <div class="button-container">
                    <button class="watch-button" id="watch-button">🎥 Watch Now</button>
                    <button id="wishlist-button">Loading...</button>
                </div>
            </div>
        </div>

        <!-- More Information Section -->
        <div class="more-info" style="margin-left:30px;">
            <p style="font-size: 20px;">${movie.description}</p>
            <h2 style="font-size: 26px;">More Information</h2>
            <p style="font-size: 23px;"><strong>Language:</strong> ${movie.details?.language?.join(', ') || 'Unknown'}</p>
            <p style="font-size: 23px;"><strong>Cast:</strong> ${movie.details?.cast?.join(', ') || 'Unknown'}</p>
            <p style="font-size: 23px;"><strong>Director:</strong> ${movie.details?.director || 'Unknown'}</p>
            <p style="font-size: 23px;"><strong>Producer:</strong> ${movie.details?.producer || 'Unknown'}</p>
        </div>
        `;

        setupWatchButton(movie);
        setupWishlist(movie);
        loadRecommendedMovies(movieId);
    } catch (error) {
        showAlert("Error Loading Details", "An error occurred while loading the movie details.", "error");
    }
}

// Watch Now Button with Subscription Check
async function setupWatchButton(movie) {
    const watchButton = document.getElementById("watch-button");

    watchButton.addEventListener("click", () => {
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                showAlert("Login Required", "Please log in to watch movies.", "warning", () => {
                    window.location.href = "./../html/login.html";
                });
                return;
            }

            const subRef = doc(db, "subscribedUsers", user.uid);
            const subSnap = await getDoc(subRef);

            if (subSnap.exists()) {
                window.location.href = `./video.html?id=${movie.id}`;
            } else {
                showAlert("Subscription Required", "You need a subscription to watch this movie.", "error", () => {
                    window.location.href = "./../html/subscribe-page.html";
                });
            }
        });
    });
}

// Wishlist Functionality (Firestore Storage)
async function setupWishlist(movie) {
    const wishlistButton = document.getElementById("wishlist-button");
    if (!wishlistButton) return;

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            wishlistButton.textContent = "💖 Add to Wishlist ";
            wishlistButton.addEventListener("click", () => {
                window.location.href = "./login.html";
            });
            return;
        }

        const userId = user.uid;
        const wishlistRef = doc(db, "wishlist", `${userId}_${movie.id}`);

        try {
            // Check if Movie is Already in Wishlist
            const docSnap = await getDoc(wishlistRef);
            let inWishlist = docSnap.exists();
            wishlistButton.textContent = inWishlist ? "❌ Remove from Wishlist" : "💖 Add to Wishlist";

            wishlistButton.onclick = async () => {
                try {
                    if (inWishlist) {
                        await deleteDoc(wishlistRef);
                        showAlert("Removed", "Movie removed from wishlist.", "success");
                        wishlistButton.textContent = "💖 Add to Wishlist";
                    } else {
                        await setDoc(wishlistRef, { 
                            ...movie,
                            userId, 
                            addedAt: new Date().toISOString()
                        });

                        showAlert("Added", "Movie added to wishlist.", "success");
                        wishlistButton.textContent = "❌ Remove from Wishlist";
                    }
                    inWishlist = !inWishlist;
                } catch (error) {
                    showAlert("Error", "Failed to update wishlist.", "error");
                }
            };
        } catch (error) {
            showAlert("Error", "Error checking wishlist.", "error");
        }
    });
}

// 🎥 Load Recommended Movies
async function loadRecommendedMovies(currentMovieId) {
    const recommendedContainer = document.getElementById("recommended-grid");
    if (!recommendedContainer) return;

    const moviesRef = collection(db, "movies");
    const querySnapshot = await getDocs(moviesRef);
    let movies = [];

    querySnapshot.forEach(doc => {
        if (doc.id !== currentMovieId) {
            let movie = doc.data();
            movie.id = doc.id;
            movies.push(movie);
        }
    });

    movies = movies.slice(0, 5);

    recommendedContainer.innerHTML = movies.map(movie => `
        <div class="movie_slide">
          <a href="details.html?id=${movie.id}">
            <img src="${movie.image_url}" alt="${movie.movie_name}" width="200" height="300">
          </a>
        </div>
    `).join("");
}

// Styled Alert Function (SweetAlert2)
function showAlert(title, text, icon, callback = null) {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonColor: "#D10000", // Kimii Horror Red
        background: "#111", // Dark theme
        color: "#fff",
        confirmButtonText: "OK",
    }).then(() => {
        if (callback) callback();
    });
}

// 🚀 Load movie details when the page loads
document.addEventListener("DOMContentLoaded", loadMovieDetails);

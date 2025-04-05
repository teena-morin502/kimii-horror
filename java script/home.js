
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyAaJ8_qJrVVJnYlSdLQ1D5vaVRpS79GZ1E",
    authDomain: "kimii-horror.firebaseapp.com",
    projectId: "kimii-horror",
    storageBucket: "kimii-horror.firebasestorage.app",
    messagingSenderId: "425936807279",
    appId: "1:425936807279:web:35d001bc3eb90dd49ff49a",
    measurementId: "G-7KM8QRZTCR"
};


const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


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

// loading the movies from the firebase.....
async function loadMovies() {
    console.log(" Loading movies...");

    const containers = {
        titleMovies: document.getElementById("titleMoviesContainer"),
        top10Movies: document.getElementById("top_10MoviesContainer"),
        realHorrorMovies: document.getElementById("real_horrorMovieContainer"),
        recommendedMovies: document.getElementById("recommendedMoviesContainer"),
    };

    if (Object.values(containers).some(container => !container)) {
        console.error("Error: Missing container elements in HTML.");
        return;
    }



    try {
        const moviesSnapshot = await getDocs(collection(db, "movies"));
        let movies = [];
        moviesSnapshot.forEach((doc) => {
            let movieData = doc.data();
            movieData.id = doc.id;
            movies.push(movieData);
        });

        console.log("Movies fetched:", movies);

        if (movies.length === 0) {
            showAlert("No Movies Found", "No movies are available at the moment.", "warning");
            return;
        }

        // Sorting & Filtering
        let top10Movies = movies.filter(movie => movie.rating >= 4).slice(0, 10);
        let realHorrorMovies = movies.filter(movie => movie.genre?.includes("Docudrama"));
        let recommendedMovies = movies.filter(movie => !top10Movies.includes(movie) && !realHorrorMovies.includes(movie)).slice(0, 5);

        // Populate Swiper Movies
        containers.titleMovies.innerHTML = "";
        movies.forEach((movie) => {
            if (movie.swiper) {
                containers.titleMovies.innerHTML += generateMovieSlideHTML(movie);
                setupWishlist(movie);
            }
        });

        // Populate Other Sections
        containers.top10Movies.innerHTML = generateMovieCardsHTML(top10Movies);
        containers.realHorrorMovies.innerHTML = generateMovieCardsHTML(realHorrorMovies);
        containers.recommendedMovies.innerHTML = generateMovieCardsHTML(recommendedMovies);

        // Attach Watch Now and swiper code Listeners
        attachWatchNowListeners();
        initializeSwiper();

    } catch (error) {
        console.error("Error Loading Movies", "An error occurred while loading the movies.", error);
    }
}

//  HTML for Swiper
function generateMovieSlideHTML(movie) {
    return `
        <div class="swiper-slide">
            <img src="${movie.swiper}" alt="${movie.movie_name}" loading="lazy" width="1500" height="500" class="swiper-image">
            <div class="movie-details-container">
                <div class="movie_name">
                    <h1>${movie.movie_name}</h1>
                    <div class="movie-meta">
                        <span>${movie.details?.duration || 'N/A'}</span>
                        <span>${movie.details?.year || 'Unknown'}</span>
                        <span>${movie.rating || 'N/A'}/5</span>
                    </div>
                    <p>${movie.description}</p>
                </div>
                <div class="button-container">
                    <button class="watch-button" id="watch-button">🎥 Watch Now</button>
                    <button id="wishlist-button">Loading...</button>
                </div>
            </div>
        </div>
    `;
}

// Generate Movie Cards (Top 10, Real Horror, Recommended)
function generateMovieCardsHTML(movies) {
    return movies.map(movie => `
        <div class="movie_slide">
            <a href="./html/details.html?id=${movie.id}">
                <img src="${movie.image_url}" alt="${movie.movie_name}" loading="lazy" width="200" height="300">
            </a>
        </div>
    `).join("");
}

function attachWatchNowListeners() {
  document.querySelectorAll(".watch-button").forEach(button => {
      button.addEventListener("click", (event) => {
          const movieId = event.target.dataset.movieId;
          if (!movieId) return;

          onAuthStateChanged(auth, async (user) => {
              if (!user) {
                  showAlert("Login Required", "Please log in to watch movies.", "warning", () => {
                      window.location.href = "./html/login.html";
                  });
                  return;
              }

              const subRef = doc(db, "subscribedUsers", user.uid);
              const subSnap = await getDoc(subRef);

              if (subSnap.exists()) {
                  window.location.href = `./html/video.html?id=${movieId}`;
              } else {
                  showAlert("Subscription Required", "You need a subscription to watch this movie.", "error", () => {
                      window.location.href = "./html/subscribe-page.html";
                  });
              }
          });
      });
  });
}



// Wishlist Functionality (Firestore Storage)
async function setupWishlist(movie) {
    const wishlistButton = document.getElementById("wishlist-button");
    if (!wishlistButton) return;

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            wishlistButton.addEventListener("click", () => {
                showAlert(
                    "Login Required",
                    "You need to log in to add movies to your wishlist.",
                    "warning",
                    () => {
                        window.location.href = "./html/login.html"; 
                    }
                );
            });
            
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


// Initialize Swiper
function initializeSwiper() {
    if (document.querySelector(".swiper")) {
        console.log("Initializing Swiper...");
        const swiper = new Swiper(".swiper", {
            loop: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            slidesPerView: 1,
            spaceBetween: 10,
        });
        setInterval(() => swiper.slideNext(), 7000);
    } else {
        console.warn("No movies found for Swiper.");
    }
}

// Load movies on page load
document.addEventListener("DOMContentLoaded", loadMovies);

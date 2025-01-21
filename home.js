const jsonPath = 'movies.json';
let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

// Function to load movies from JSON
async function loadMovies() {
    try {
        const response = await fetch(jsonPath);
        const movies = await response.json();
        const movieArray = movies.movies || [];

        if (!Array.isArray(movieArray)) {
            throw new Error('Movies data is not an array');
        }

        // Get containers from the DOM
        const titleMoviesContainer = document.getElementById('titleMoviesContainer');
        const top10Container = document.getElementById('top_10MoviesContainer');
        const recommendedContainer = document.getElementById('recommendedMoviesContainer');
        const realHorrorContainer = document.getElementById('real_horrorMovieContainer');

        if (!titleMoviesContainer || !top10Container || !recommendedContainer || !realHorrorContainer) {
            throw new Error('One or more containers are missing in the DOM.');
        }

        // Populate Swiper movies
        movieArray.forEach((movie) => {
            if (movie.swiper) {
                const slide = `
                    <div class="swiper-slide" style="position: relative;">
                        <img src="${movie.swiper}" alt="${movie.movie_name}" width="1500" height="500" class="swiper-image">
                        <div class="movie-details-container">
                            <div class="movie_name" style="top:10px;">
                                <h1>${movie.movie_name}</h1>
                                <div class="movie-meta">
                                    <span style="font-size: 20px;">${movie.details?.duration || 'N/A'}</span>
                                    <span style="font-size: 20px;">${movie.details?.year || 'Unknown'}</span>
                                    <span style="font-size: 20px;">${movie.rating || 'N/A'}/5</span>
                                </div>
                                <p style="font-size: 20px;">${movie.description}</p>
                            </div>
                            <div class="button-container">
                                <button class="login-button watch-now" data-id="${movie.id}">Watch now</button>
                                <button class="watchlist-button add-watchlist" data-id="${movie.id}">+</button>
                            </div>
                        </div>
                    </div>
                `;
                titleMoviesContainer.innerHTML += slide;
            }
        });

        // Initialize Swiper if slides exist
        if (titleMoviesContainer.children.length > 0) {
            const swiper = new Swiper('.swiper', {
                loop: true,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                slidesPerView: 1,
                spaceBetween: 10,
            });
            // Auto-slide every 3 seconds
          setInterval(() => {
          swiper.slideNext();
          }, 7000);
        } else {
            console.warn("No movies with swiper images found.");
        }

        // Populate movie sections
        movieArray.forEach((movie) => {
            if (!movie.image_url) return;  // Skip if no image URL provided

            const movieCard = `
                <div class="movie_slide">
                    <a href="details.html?id=${movie.id}&movie_name=${encodeURIComponent(movie.movie_name)}">
                        <img src="${movie.image_url}" alt="${movie.movie_name}" width="200" height="300">
                    </a>
                </div>
            `;

            // Categorize movies
            if (movie.rating >= 4) {
                top10Container.innerHTML += movieCard;
            }
            if (movie.gener?.includes('docudrama')) {
                realHorrorContainer.innerHTML += movieCard;
            } else {
                recommendedContainer.innerHTML += movieCard;
            }
        });

        // Event listeners for Watch Now and Watchlist buttons
        document.querySelectorAll('.watch-now').forEach(button => {
            button.addEventListener('click', (event) => {
                const movieId = event.target.getAttribute('data-id');
                const selectedMovie = movieArray.find(m => m.id == movieId);
                if (selectedMovie) {
                    localStorage.setItem('currentMovie', JSON.stringify(selectedMovie));
                    window.location.href = `video.html?id=${movieId}`;
                }
            });
        });

        document.querySelectorAll('.add-watchlist').forEach(button => {
            button.addEventListener('click', (event) => {
                const movieId = event.target.getAttribute('data-id');
                const selectedMovie = movieArray.find(m => m.id == movieId);
                if (selectedMovie) {
                    toggleWatchlist(selectedMovie, event.target);
                }
            });
        });

    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

// Function to toggle movie in watchlist
function toggleWatchlist(movie, buttonElement) {
    const index = watchlist.findIndex(item => item.id === movie.id);
    if (index === -1) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        buttonElement.textContent = 'Remove from Watchlist';
        alert(`Added "${movie.movie_name}" to your watchlist.`);
    } else {
        watchlist.splice(index, 1);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        buttonElement.textContent = '+';
        alert(`Removed "${movie.movie_name}" from your watchlist.`);
    }
}

// Load movies when the page is ready
document.addEventListener('DOMContentLoaded', loadMovies);

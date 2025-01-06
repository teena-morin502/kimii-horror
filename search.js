const searchInput = document.getElementById('filter');
const resultContainer = document.getElementById('result-container');

// Load movie data from JSON
async function loadMoviesData() {
    try {
        const response = await fetch('movies.json');
        if (!response.ok) {
            console.error("Failed to fetch movies.json:", response.status);
            return [];
        }
        const data = await response.json();
        return data.movies || [];
    } catch (error) {
        console.error("Error loading movies.json:", error);
        return [];
    }
}

resultContainer.style.display = 'none';

// Filter movies based on search term
async function filterMovies() {
    const movies = await loadMoviesData();
    const searchTerm = searchInput.value.toLowerCase();
    resultContainer.innerHTML = '';

    if (searchTerm.trim() === '') {
        resultContainer.style.display = 'none';
        return;
    }

    const filteredMovies = movies.filter((movie) => {
        const { movie_name, gener } = movie;

        // Ensure `gener` is an array before calling `.some()`
        const genreMatch = Array.isArray(gener)
            ? gener.some((genre) => genre.toLowerCase().includes(searchTerm))
            : false;

        return (
            movie_name.toLowerCase().includes(searchTerm) || genreMatch
        );
    });

    if (filteredMovies.length > 0) {
        filteredMovies.forEach((movie) => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            const releaseYear = movie.details?.year || 'N/A';
            movieCard.innerHTML = `
                <img src="${movie.image_url || 'default-image.jpg'}" alt="${movie.movie_name}" width="150" height="200">
                <div>
                    <h3>${movie.movie_name}</h3>
                    <p>${releaseYear}</p>
                    <p>Rating: ${movie.rating || 'N/A'}</p>
                </div>
            `;

            // Add click event to the movie card
            movieCard.addEventListener('click', () => {
                // Save the selected movie ID in localStorage
                localStorage.setItem('selectedMovieId', movie.id);

                // Redirect to the details page
                window.location.href = `details.html?id=${movie.id}`;
            });

            resultContainer.appendChild(movieCard);
        });

        resultContainer.style.display = 'block';
    } else {
        resultContainer.innerHTML = `<p>No matches found for "${searchTerm}"</p>`;
        resultContainer.style.display = 'block';
    }
}

// Add input event listener to the search box
searchInput.addEventListener('input', filterMovies);

// Hide result container when clicking outside
document.addEventListener('click', (event) => {
    if (
        !resultContainer.contains(event.target) &&
        !searchInput.contains(event.target)
    ) {
        resultContainer.innerHTML = '';
        resultContainer.style.display = 'none';
    }
});

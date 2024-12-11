const searchInput = document.getElementById('filter');
const resultContainer = document.getElementById('result-container');

async function loadMoviesData() {
    const response = await fetch('movies.json');
    const data = await response.json();
    return data.movies || [];
}

async function filterMovies() {
    const movies = await loadMoviesData();
    const searchTerm = searchInput.value.toLowerCase();
    resultContainer.innerHTML = '';

    if (searchTerm.trim() === '') {
        return;
    }

    const filteredMovies = movies.filter((movie) => {
        const { movie_name, gener, details } = movie;
        return (
            movie_name.toLowerCase().includes(searchTerm) ||
            gener.some((genre) => genre.toLowerCase().includes(searchTerm))
        );
    });

    if (filteredMovies.length > 0) {
        filteredMovies.forEach((movie) => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.innerHTML = `
                <img src="${movie.image_url}" alt="${movie.movie_name}" width="150" height="200">
          <div>
                <h3>${movie.movie_name}</h3>
                <p>${movie.gener.join(', ')}</p> 
            </div>
            `;
            resultContainer.appendChild(movieCard);
        });
    } else {
        resultContainer.innerHTML = `<p>No matches found for "${searchTerm}"</p>`;
    }
}

searchInput.addEventListener('input', filterMovies);

const queryParams = new URLSearchParams({
    movie_name: movie.movie_name || 'Unknown',
    description: movie.description || 'No description available',
    image_url: movie.image_url || '',
    rating: movie.rating || 'N/A',
    genre: movie.gener?.join(', ') || 'Unknown',
    cast: movie.details?.cast?.join(', ') || 'Unknown',
    director: movie.details?.director || 'Unknown',
    producer: movie.details?.producer || 'Unknown',
    duration: movie.details?.duration || 'N/A',
    language: movie.details?.language?.join(', ') || 'Unknown',
    year: movie.details?.year || 'Unknown'
}).toString();


movieLink.href = `details.html?${queryParams}`;

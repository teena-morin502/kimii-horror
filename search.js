const searchInput = document.getElementById('filter');
const resultContainer = document.getElementById('result-container');

// Load movie data from JSON
async function loadMoviesData() {
    const response = await fetch('movies.json');
    const data = await response.json();
    return data.movies || [];
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

            // Add click event to the movie card
            movieCard.addEventListener('click', () => {
                // Save the selected movie details in localStorage
                localStorage.setItem('selectedMovie', JSON.stringify(movie));

                // Redirect to the details page
                window.location.href = 'details.html';
            });
            resultContainer.appendChild(movieCard);
            resultContainer.style.display = 'block';
        });
    } else {
        resultContainer.innerHTML = `<p>No matches found for "${searchTerm}"</p>`;
        resultContainer.style.display = 'block';
    }
}

// Add input event listener to the search box
searchInput.addEventListener('input', filterMovies);

document.addEventListener('click', (event) => {
    if (
        !resultContainer.contains(event.target) && 
        !searchInput.contains(event.target)){
        resultContainer.innerHTML = '';
        resultContainer.style.display = 'none';
    }
});

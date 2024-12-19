const jsonPath = 'movies.json';

async function loadMovies() {
    try {
        const response = await fetch(jsonPath);

        const movies = await response.json();
        const movieArray = movies.movies || movies || [];

        if (!Array.isArray(movieArray)) {
            throw new Error('Movies data is not an array');
        }

        const top10Container = document.querySelector('#top_10MoviesContainer');
        const recomendedContainer = document.querySelector('#recomendedMoviesContainer');
        const realHorrorContainer = document.querySelector('#real_horrorMovieContainer');

        if (!top10Container || !recomendedContainer || !realHorrorContainer) {
            throw new Error('One or more containers are missing in the DOM.');
        }

        movieArray.forEach(movie => {
            console.log('Movie:', movie); 

            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie_slide');

            const movieImage = document.createElement('img');
            movieImage.alt = movie.movie_name || 'Unknown Movie';
            movieImage.src = movie.image_url;
            movieImage.width = 200;
            movieImage.height = 300;

            const movieLink = document.createElement('a');
            movieLink.href = 'details.html'; 
            movieLink.addEventListener('click', () => {
                localStorage.setItem('selectedMovie', JSON.stringify(movie));
            });

            movieLink.appendChild(movieDiv);
            movieDiv.appendChild(movieImage);

            if (movie.rating >=3) {
                top10Container.appendChild(movieLink.cloneNode(true));
            }

            if (movie.gener?.includes('docudrama')) {
                realHorrorContainer.appendChild(movieLink);
            }else if (movie.gener?.includes('Horror')) {
                recomendedContainer.appendChild(movieLink);
            }
        });
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadMovies);

async function fetchMoviesByGenre() {
    try {

        const response = await fetch('movies.json');
        const data = await response.json();

        console.log('Fetched data:', data);


        const movies = data.movies || data.categories || [];

        if (!Array.isArray(movies)) {
            throw new Error('Movies data is not an array');
        }

        const top10Container = document.querySelector('#top_10MoviesContainer');
        const thrillerContainer = document.querySelector('#thrillerMoviesContainer');
        const realHorrorContainer = document.querySelector('#real_horrorMovieContainer');
        const supernaturalContainer = document.querySelector('#supernaturalMovieContainer');
        const title_movie_container = document.getElementById("titleMoviesContainer");

        movies.forEach(movie => {

            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie_slide');
        
            const movieImage = document.createElement('img');
            movieImage.alt = movie.movie_name || 'Unknown Movie';
            movieImage.src = movie.image_url || 'path/to/default-image.jpg'; // Add default image URL if needed
            movieImage.width = 200;
            movieImage.height = 300;

            const movieLink = document.createElement('a');

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
 
            movieLink.appendChild(movieDiv);
            movieDiv.appendChild(movieImage);
        

            if (movie.rating >= 8) {
                top10Container.appendChild(movieLink.cloneNode(true));
            }
            if (movie.gener?.includes('Thriller')) {
                thrillerContainer.appendChild(movieLink.cloneNode(true));
            }
            if (movie.gener?.includes('docudrama')) {
                realHorrorContainer.appendChild(movieLink.cloneNode(true));
            }
            if (movie.gener?.includes('Supernatural')) {
                supernaturalContainer.appendChild(movieLink.cloneNode(true));
            }
        });
        


    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchMoviesByGenre);


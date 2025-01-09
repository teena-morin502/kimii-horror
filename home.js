// const jsonPath = 'movies.json';

// async function loadMovies() {
//     try {
//         const response = await fetch(jsonPath);
//         const movies = await response.json();
//         const movieArray = movies.movies || [];

//         if (!Array.isArray(movieArray)) {
//             throw new Error('Movies data is not an array');
//         }

//         // Containers
//         const titleMoviesContainer = document.getElementById('titleMoviesContainer');
//         const top10Container = document.getElementById('top_10MoviesContainer');
//         const recommendedContainer = document.getElementById('recommendedMoviesContainer');
//         const realHorrorContainer = document.getElementById('real_horrorMovieContainer');

//         if (!titleMoviesContainer || !top10Container || !recommendedContainer || !realHorrorContainer) {
//             throw new Error('One or more containers are missing in the DOM.');
//         }

//         // Retrieve movie ID from local storage
//         const storedMovieId = localStorage.getItem('selectedMovieId');

//         // Populate Swiper (Carousel)
//         movieArray.forEach((movie) => {
//             if (movie.swiper) {
//                 const slide = document.createElement('div');
//                 slide.classList.add('swiper-slide');
//                 slide.style.position = 'relative';

//                 // Swiper image
//                 const swiperImage = document.createElement('img');
//                 swiperImage.src = movie.swiper;
//                 swiperImage.alt = movie.movie_name;
//                 swiperImage.width = 1490;
//                 swiperImage.height = 500;
//                 swiperImage.classList.add('swiper-image');

//                 // Check if the movie ID matches the one in local storage
//                 if (storedMovieId && Number(storedMovieId) === movie.id) {
//                     swiperImage.classList.add('fade-out'); // Apply fade effect

//                     // Create and append the corresponding card below the image
//                     const card = createMovieCard(movie);
//                     card.style.position = 'absolute';
//                     card.style.bottom = '20px'; // Position below the image
//                     card.style.left = '50%';
//                     card.style.transform = 'translateX(-50%)';
//                     card.style.zIndex = '2';

//                     slide.appendChild(card);
//                 }

//                 slide.appendChild(swiperImage);
//                 titleMoviesContainer.appendChild(slide);
//             }
//         });

//         // Initialize Swiper if there are slides
//         if (titleMoviesContainer.children.length > 0) {
//             const swiper = new Swiper('.swiper', {
//                 loop: true,
//                 navigation: {
//                     nextEl: '.swiper-button-next',
//                     prevEl: '.swiper-button-prev',
//                 },
//                 slidesPerView: 1,
//                 spaceBetween: 10,
//             });

//             // Auto-slide every 5 seconds
//             setInterval(() => {
//                 swiper.slideNext();
//             }, 5000);
//         } else {
//             console.warn("No movies with swiper images found.");
//         }

//         // Populate Other Sections
//         movieArray.forEach((movie) => {
//             if (!movie.image_url) return; // Skip movies without images

//             // Create movie card
//             const movieDiv = document.createElement('div');
//             movieDiv.classList.add('movie_slide');

//             // Add image
//             const movieImage = document.createElement('img');
//             movieImage.alt = movie.movie_name || 'Unknown Movie';
//             movieImage.src = movie.image_url;
//             movieImage.width = 200;
//             movieImage.height = 300;

//             // Create link for the movie
//             const movieLink = document.createElement('a');
//             const encodedMovieName = encodeURIComponent(movie.movie_name || 'Unknown Movie');
//             movieLink.href = `details.html?id=${movie.id}&movie_name=${encodedMovieName}`;
//             movieLink.appendChild(movieImage);

//             movieDiv.appendChild(movieLink);

//             // Append to appropriate container
//             if (movie.rating >= 4) {
//                 top10Container.appendChild(movieDiv.cloneNode(true)); // Top 10 Movies
//             }

//             if (movie.gener?.includes('docudrama')) {
//                 realHorrorContainer.appendChild(movieDiv.cloneNode(true)); // Based on Real Stories
//             } else {
//                 recommendedContainer.appendChild(movieDiv); // Recommended Movies
//             }
//         });
//     } catch (error) {
//         console.error('Error loading movies:', error);
//     }
// }

// // Helper function to create a movie card
// function createMovieCard(movie) {
//     const movieDiv = document.createElement('div');
//     movieDiv.classList.add('movie_slide');

//     const movieImage = document.createElement('img');
//     movieImage.alt = movie.movie_name || 'Unknown Movie';
//     movieImage.src = movie.image_url;
//     movieImage.width = 200;
//     movieImage.height = 300;

//     const movieLink = document.createElement('a');
//     const encodedMovieName = encodeURIComponent(movie.movie_name || 'Unknown Movie');
//     movieLink.href = `details.html?id=${movie.id}&movie_name=${encodedMovieName}`;
//     movieLink.appendChild(movieImage);

//     movieDiv.appendChild(movieLink);
//     return movieDiv;
// }

// document.addEventListener('DOMContentLoaded', loadMovies);






















const jsonPath = 'movies.json';

async function loadMovies() {
    try {
        const response = await fetch(jsonPath);
        const movies = await response.json();
        const movieArray = movies.movies || [];

        if (!Array.isArray(movieArray)) {
            throw new Error('Movies data is not an array');
        }

        // Containers
        const titleMoviesContainer = document.getElementById('titleMoviesContainer');
        const top10Container = document.getElementById('top_10MoviesContainer');
        const recommendedContainer = document.getElementById('recommendedMoviesContainer');
        const realHorrorContainer = document.getElementById('real_horrorMovieContainer');

        if (!titleMoviesContainer || !top10Container || !recommendedContainer || !realHorrorContainer) {
            throw new Error('One or more containers are missing in the DOM.');
        }

        // Retrieve movie ID from local storage
        const storedMovieId = localStorage.getItem('selectedMovieId');

        // Populate Swiper (Carousel)
        movieArray.forEach((movie) => {
            if (movie.swiper) {
                const slide = document.createElement('div');
                slide.classList.add('swiper-slide');
                slide.style.position = 'relative';

                // Swiper image
                const swiperImage = document.createElement('img');
                swiperImage.src = movie.swiper;
                swiperImage.alt = movie.movie_name;
                swiperImage.width = 1490;
                swiperImage.height = 500;
                swiperImage.classList.add('swiper-image');

                // Create the card element for the movie
                const card = createMovieCard(movie);
                card.style.position = 'absolute';
                card.style.bottom = '20px'; // Position below the image
                card.style.left = '50%';
                card.style.transform = 'translateX(-50%)';
                card.style.zIndex = '2';

                // Add the card to the slide, ensuring it moves with the image
                slide.appendChild(swiperImage);
                slide.appendChild(card);
                titleMoviesContainer.appendChild(slide);
            }
        });

        // Initialize Swiper if there are slides
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
            }, 3000);
        } else {
            console.warn("No movies with swiper images found.");
        }

        // Populate Other Sections
        movieArray.forEach((movie) => {
            if (!movie.image_url) return; // Skip movies without images

            // Create movie card
            const movieDiv = document.createElement('div');
            movieDiv.classList.add('movie_slide');

            // Add image
            const movieImage = document.createElement('img');
            movieImage.alt = movie.movie_name || 'Unknown Movie';
            movieImage.src = movie.image_url;
            movieImage.width = 200;
            movieImage.height = 300;

            // Create link for the movie
            const movieLink = document.createElement('a');
            const encodedMovieName = encodeURIComponent(movie.movie_name || 'Unknown Movie');
            movieLink.href = `details.html?id=${movie.id}&movie_name=${encodedMovieName}`;
            movieLink.appendChild(movieImage);

            movieDiv.appendChild(movieLink);

            // Append to appropriate container
            if (movie.rating >= 4) {
                top10Container.appendChild(movieDiv.cloneNode(true)); // Top 10 Movies
            }

            if (movie.gener?.includes('docudrama')) {
                realHorrorContainer.appendChild(movieDiv.cloneNode(true)); // Based on Real Stories
            } else {
                recommendedContainer.appendChild(movieDiv); // Recommended Movies
            }
        });
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

// Helper function to create a movie card
function createMovieCard(movie) {
    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie_card'); // Use a distinct class for cards

    const movieImage = document.createElement('img');
    movieImage.alt = movie.movie_name || 'Unknown Movie';
    movieImage.src = movie.card;
    movieImage.width = 300;
    movieImage.height = 300;
    movieImage.classList.add("name-card")

    const movieLink = document.createElement('a');
    movieLink.style.position = 'relative';
    const encodedMovieName = encodeURIComponent(movie.movie_name || 'Unknown Movie');
    movieLink.href = `details.html?id=${movie.id}&movie_name=${encodedMovieName}`;
    movieLink.appendChild(movieImage);

    movieDiv.appendChild(movieLink);
    return movieDiv;
    
}

document.addEventListener('DOMContentLoaded', loadMovies);


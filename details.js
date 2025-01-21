       // Watchlist storage
       let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

       // Add to Watchlist
       function addToWatchlist(movie) {
           if (!watchlist.find(item => item.id === movie.id)) {
               watchlist.push(movie);
               localStorage.setItem('watchlist', JSON.stringify(watchlist));
               updateWatchlistCount();
           }
       }

       // Remove from Watchlist
       function removeFromWatchlist(movieId) {
           watchlist = watchlist.filter(movie => movie.id !== movieId);
           localStorage.setItem('watchlist', JSON.stringify(watchlist));
           updateWatchlistCount(); // Update the watchlist count
           alert('Movie removed from watchlist!');
       }

       // Load Movie Details
       async function loadMovieDetails() {
   const detailsContainer = document.getElementById('movie-details');
   const recommendedMoviesContainer = document.getElementById('recommended-grid');
   const urlParams = new URLSearchParams(window.location.search);
   const movieId = urlParams.get('id');
   if (!movieId) {
       detailsContainer.innerHTML = '<p>No movie selected. Please go back and select a movie.</p>';
       return;
   }
   try {
       const response = await fetch('movies.json');
       const data = await response.json();
       const movie = data.movies.find(m => m.id === movieId);
       if (!movie) {
           detailsContainer.innerHTML = '<p>Movie not found. Please try again.</p>';
           return;
       }
       const trailerEmbedUrl = movie.details.video_url.replace('watch?v=', 'embed/');
       // Populate movie details
       detailsContainer.innerHTML = `
       <div class="movie_name">
                   <h1>${movie.movie_name}</h1>
                   <div class="movie-meta">
                       <span style="font-size: 20px;" class="movie-meta-box">${movie.details?.duration || 'N/A'}</span>
                       <span style="font-size: 20px;">${movie.details?.year || 'Unknown'}</span>
                       <span style="font-size: 20px;" class="movie-meta-box">${movie.rating || 'N/A'}/5</span>
                   </div>
               </div>
          <div class="movie-details-container">
               <div class="movie-poster">
                   
                <img src="${movie.image_url}" alt="${movie.movie_name}" width="300" height="420">
               </div>
               <div class="movie-info">
                           <div id="video-container">
                           <iframe
                               width="800"
                               height="350"
                               src="${trailerEmbedUrl}"
                               frameborder="0"
                               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                               allowfullscreen>
                           </iframe>
                       </div>
                   <div class="button-container">
                       <button class="login-button" id="watch-button">Watch now</button>
                       <button class="watchlist-button" id="add-watchlist-button">+</button>
                   </div>

               </div>
           </div>
           <div class="more-info" style="margin-left:30px;">
               <p style="font-size: 20px;">${movie.description}</p>
               <h2 style="font-size: 26px;">More Information</h2>
               <p style="font-size: 23px;"><strong>Language:</strong> ${movie.details?.language?.join(', ') || 'Unknown'}</p>
               <p style="font-size: 23px;"><strong>Cast:</strong> ${movie.details?.cast?.join(', ') || 'Unknown'}</p>
               <p style="font-size: 23px;"><strong>Director:</strong> ${movie.details?.director || 'Unknown'}</p>
               <p style="font-size: 23px;"><strong>Producer:</strong> ${movie.details?.producer || 'Unknown'}</p>
           </div>
       `;
       // Watch Now functionality
       document.getElementById('watch-button').addEventListener('click', () => {
           localStorage.setItem('currentMovie', JSON.stringify(movie));
           window.location.href = 'video.html?id=' + movie.id;
       });
       // Watchlist functionality
       const isInWatchlist = watchlist.some(item => item.id === movie.id);
       const watchlistButton = document.getElementById('add-watchlist-button');
       if (isInWatchlist) {
           watchlistButton.textContent = 'Remove from Watchlist';
       }

       watchlistButton.addEventListener('click', () => {
           if (isInWatchlist) {
               removeFromWatchlist(movie.id);
               watchlistButton.textContent = '+';
           } else {
               addToWatchlist(movie);
               watchlistButton.textContent = 'Remove from Watchlist';
           }
       })
               // Load recommended movies (excluding the current one)
       const allMovies = data.movies.filter(m => m.id !== movie.id);
       const recommendedMovies = allMovies.sort(() => 0.5 - Math.random()).slice(0, 10);
       recommendedMovies.forEach(recommendedMovie => {
           const movieCard = document.createElement('div');
           movieCard.classList.add('movie-card');
           const movieImage = document.createElement('img');
           movieImage.src = recommendedMovie.image_url;
           movieImage.alt = recommendedMovie.movie_name;
           movieImage.classList.add('movie-card-img');
           // Create link for the recommended movie
           const movieLink = document.createElement('a');
           const encodedMovieName = encodeURIComponent(recommendedMovie.movie_name || 'Unknown Movie');
           movieLink.href = `details.html?id=${recommendedMovie.id}&movie_name=${encodedMovieName}`;
           movieLink.appendChild(movieImage);
           movieCard.appendChild(movieLink);
           recommendedMoviesContainer.appendChild(movieCard);
       });
   } catch (error) {
       console.error('Error loading movie details:', error);
       detailsContainer.innerHTML = '<p>Error loading movie details. Please try again.</p>';
   }
}
       // Load the movie details and update the watchlist count
       document.addEventListener('DOMContentLoaded', () => {
           loadMovieDetails(); // Load the movie details when page is ready
       });
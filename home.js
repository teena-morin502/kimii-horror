import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
// Note: Removed firebase-analytics.js import since it's not being used here

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
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  async function uploadJSONToFirebase() {
    try {
        const response = await fetch('movie.json'); // Assuming movie.json is in your public directory
        if (!response.ok){
          throw new Error("JSON file not found!");
        }
        const data = await response.json();  // Parse JSON data

        // Loop through categories in the JSON data
        for (const category in data.category) {
            const categoryData = data.category[category];
            
            // Create a new document reference in the 'categories' collection using category name
            const docRef = doc(db, "categories", category);

            // Set the data for that category, including the movies inside that category
            await setDoc(docRef, { movies: categoryData });
            console.log(`Uploaded category: ${category}`);
        }

        const top_10_movie_container=document.getElementById("top_10MoviesContainer");
          data.category.top_10.forEach(movie => {
            top_10_movie_container.innerHTML+=`
                  <div>
                      <img src="${movie.image_url}" class="movie_slide" alt="${movie.movie_name}" width="200px" height="300px">
                        <p class="movie_name"  >${movie.movie_name} </p>
                  </div>`
                  
          });


         // Render thriller movies
         const thriller_movie_container = document.getElementById("thrillerMoviesContainer");
         data.category.thriller.forEach(movie => {
           thriller_movie_container.innerHTML += `
             <div>
               <img src="${movie.image_url}" class="movie_slide" alt="${movie.movie_name}" width="200px" height="300px">
               <p class="movie_name">${movie.movie_name}</p>
             </div>`;
         });

          // Render based_on_real_horror movies
          const real_horror_movie_container = document.getElementById("real_horrorMovieContainer");
          data.category.real_horror.forEach(movie => {
            real_horror_movie_container.innerHTML += `
              <div >
                <img src="${movie.image_url}" class="movie_slide" alt="${movie.movie_name}" width="200px" height="300px">
                <p class="movie_name">${movie.movie_name}</p>
             </div>`;
            
         });


          // Render based_on_real_stories movies
          const real_stories_movie_container = document.getElementById("real_storiesMovieContainer");
          data.category.real_story.forEach(movie => {
            real_stories_movie_container.innerHTML += `
              <div>
                 <img src="${movie.image_url}" class="movie_slide" alt="${movie.movie_name}" width="200px" height="300px">
                <p class="movie_name">${movie.movie_name}</p>
               </div>`;
          });
          
          //Render hero tag slides
          const title_movie_container = document.getElementById("titleMoviesContainer");
          data.category.slide.forEach(movie => {
            title_movie_container.innerHTML += `
              <div class="swiper-slide">
                 <img src="${movie.img}" class="movie" alt="${movie.movie_name}"" width="100%" height="700px">
               </div>`;
          });

    } catch (error) {
        console.error("Error uploading JSON data:", error);
        document.getElementById("thrillerMoviesContainer").innerHTML = "<p>Failed to load movies.</p>";
    }
  }
window.addEventListener("load", uploadJSONToFirebase);



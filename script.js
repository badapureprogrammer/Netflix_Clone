// Consts
const apikey = "fa4a4b1c7cb9bbcd52b95287199855df";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
  fetchTrending: `${apiEndpoint}//trending/movie/week?api_key=${apikey}`,
  fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
  fetchMovieList: (id) =>
    `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
};

// Boots up the app
function init() {
  fetchTrendingMovies();
  fetchAndBuildAllSections();
}

function fetchTrendingMovies() {
  fetchAndbuildMovieSection(apiPaths.fetchTrending, "Trending ")
    .then((res) => {
      // buildBannerSection(list[0]);
      console.log(res);
    })
    .catch((error) => {
      console.log(error);
    });
}

function buildBannerSection(movie) {
  const bannerContainer = document.getElementById("banner-section");
  bannerContainer.style.backgroundImage = `${imgPath}${item.backdrop_path}`;

  const div = document.createElement("div");
  div.innerHTML = `
  <h2 class="banner_title">${movie.title}</h2>
  <p class="banner_info">#4 in TV Shows Today</p>
  <p class="banner_overview">
    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Blanditiis
  </p>
  <div class="action-buttons-container">
    <button type="button" class="action-button">
      <i class="fa fa-play"></i> Play
    </button>
    <button type="button" class="action-button">
      <i class="fa fa-circle-info"></i> More Info
    </button>
  </div>`;
  div.className = "banner-content container";
  bannerContainer.append(div);
}

function fetchAndBuildAllSections() {
  fetch(apiPaths.fetchAllCategories)
    .then((res) => res.json())
    .then((res) => {
      const categories = res.genres;
      if (Array.isArray(categories) && categories.length) {
        categories.slice(0, 3).forEach((category) => {
          fetchAndbuildMovieSection(
            apiPaths.fetchMovieList(category.id),
            category.name
          );
        });
      }
      // console.table(categories);
    })
    .catch((error) => console.log(error));
}

function fetchAndbuildMovieSection(fetchUrl, categoryName) {
  return fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMovieSection(movies, categoryName);
      }
      return movies;
    })
    .catch((error) => console.log(error));
}

function buildMovieSection(list, categoryName) {
  const moviesContain = document.getElementById("movie-contain");

  const movieListImage = list
    .map((item) => {
      return `
    <img class="movie-item" src="${imgPath}${item.backdrop_path}" alt="${item.title}"/>`;
    })
    .join();

  const movieSectionHTML = `<h2 class="movie-section-heading">${categoryName}<span class="explore-nudge">Explore All</span></h2>
                            <div class="movie-image-container">
                                ${movieListImage}
                            </div>`;

  const div = document.createElement("div");
  div.className = "movie-section";
  div.innerHTML = movieSectionHTML;

  // append HTML into movies Container
  moviesContain.append(div);
}

window.addEventListener("load", function () {
  init();
});

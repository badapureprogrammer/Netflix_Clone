// Consts
const apikey = "fa4a4b1c7cb9bbcd52b95287199855df";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
  fetchTrending: `${apiEndpoint}//trending/movie/week?api_key=${apikey}`,
  fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
  fetchMovieList: (id) =>
    `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
  searchOnYoutube: (query) =>
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyCl5fteqZhgeZjMSG0eAEsjZmfh83Exv7k`,
};

// Boots up the app
function init() {
  fetchTrendingMovies();
  searchMovieTrailer();
  fetchAndBuildAllSections();
}

function fetchTrendingMovies() {
  fetchAndbuildMovieSection(apiPaths.fetchTrending, "Trending Now")
    .then((list) => {
      const randonIndex = parseInt(Math.random() * list.length);
      buildBannerSection(list[randonIndex]);
    })
    .catch((error) => {
      console.log(error);
    });
}

function buildBannerSection(movie) {
  const bannerContainer = document.getElementById("banner-section");
  bannerContainer.style.backgroundImage = `url(${imgPath}${movie.backdrop_path})`;

  const div = document.createElement("div");
  div.innerHTML = `
  <h2 class="banner_title">${movie.title}</h2>
  <p class="banner_info">${movie.release_date}</p>
  <p class="banner_overview">${
    movie.overview && movie.overview.length > 20
      ? movie.overview.slice(0, 200).trim() + "..."
      : movie.overview
  }</p>
  <div class="action-buttons-container">
      <button type="button" class="action-button"><i class="fa fa-play"></i> Play</button>
      <button type="button" class="action-button"><i class="fa fa-circle-info"></i> More Info</button>
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
        categories.forEach((category) => {
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
      <div class="movie-item">
          <img class="movie-item-image" src="${imgPath}${item.backdrop_path}" alt="${item.title}" onclick="searchMovieTrailer('${item.title}')"/>
          <iframe width="240px" src="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1"></iframe>
      </div>`;
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

function searchMovieTrailer(movieName) {
  // if (!movieName) return;

  fetch(apiPaths.searchOnYoutube(movieName))
    .then((res) => res.json())
    .then((res) => {
      const result = res.items[0];
      const youtubeUrl = `https://www.youtube.com/watch?v=${result.id.videoId}`;
      console.log(youtubeUrl);
      window.open(youtubeUrl, "_blank");
    })
    .catch((error) => {
      console.log(error);
    });
}

window.addEventListener("load", function () {
  init();

  window.addEventListener("scroll", function () {
    // header ui update
    const header = document.getElementById("header");
    if (window.scrollY > 10) header.classList.add("black-bg");
    else header.classList.remove("black-bg");
  });
});

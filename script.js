// Consts
const apikey = "fa4a4b1c7cb9bbcd52b95287199855df";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";

const apiPaths = {
  fetchAllCategories: `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
  fetchMovieList: (id) =>
    `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
};

// Boots up the app
function init() {
  fetchAndBuildAllSections();
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
            category
          );
        });
      }
      // console.table(categories);
    })
    .catch((error) => console.log(error));
}

function fetchAndbuildMovieSection(fetchUrl, category) {
  fetch(fetchUrl)
    .then((res) => res.json())
    .then((res) => {
      // console.table(res.results);
      const movies = res.results;
      if (Array.isArray(movies) && movies.length) {
        buildMovieSection(movies, category.name);
      }
    })
    .catch((error) => console.log(error));
}

function buildMovieSection(list, categoryName) {
  // console.log(list, categoryName);
  console.log(list);

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

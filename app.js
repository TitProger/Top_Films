const API_KEY = "7715da1a-3661-41b2-aaff-47e1281cfeb2";
const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=1';
const API_URL_POPULAR_INFO = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';

getMovies(API_URL_POPULAR);

async function getMovies(url) {
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  showMovies(respData);
  console.log(respData);
}

function getClassByRate(point) {
  if (point >= 7) {
    return "green";
  }
  if (point > 5) {
    return "orange";
  }
  if (point === null) {
    return "white";
  } else {
    return "red";
  }
}

function showMovies(data) {
  const moviesEL = document.querySelector(".movies");
  data.items.forEach((movie) => {
    const movieEL = document.createElement("div");
    movieEL.classList.add("movie");
    movieEL.innerHTML = `
      <div class="movie_cover-inne">
        <img 
          src="${movie.posterUrlPreview}" 
          class="movie_cover"
          alt="${movie.nameRu}"
        />
        <div class="movier_cover-darkened"></div>
      </div>
      <div class="movie_info">
        <div class="movie_title">${movie.nameRu}</div>
        <div class="movi_category">${movie.genres.map(
          (genre) => ` ${genre.genre} `
        )}</div>
        <div class="movie_avereage movie_avereage-${getClassByRate(movie.ratingImdb)}">${movie.ratingImdb}</div>
      </div>
    `;
    movieEL.addEventListener("click", () => OpenModal(movie.kinopoiskId));
    moviesEL.appendChild(movieEL);
  });
}

const modalEl = document.querySelector(".modal");

async function OpenModal(id) {
  const resp = await fetch(API_URL_POPULAR_INFO + id, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  modalEl.innerHTML = `
    <div class="modal_cart">
      <img 
        class="moadal_img" 
        src="${respData.posterUrlPreview}" 
        alt="${respData.nameRu}"
      />
      <h2>
        <span class="modal_name">${respData.nameRu}</span>
        <span class="modal_yer">${respData.year}</span>
      </h2>
      <ul class="modal_info">
        <li class="modal_ganer">Жанр - ${respData.genres.map((genre) => genre.genre).join(", ")}</li>
        <li class="modal_tame">Страна - ${respData.countries[0].country}</li>
        <li>Сайт: <a class="modal_saite" href="${respData.description}">${respData.webUrl}</a></li>
        <li class="modal_infotmation" >${respData.description}</li>
      </ul>
      <button type="button" class="modal_button">Закрыть</button>
    </div>
  `;
  modalEl.style.display = "block";
  console.log(respData.webUrl)
}

modalEl.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal_button")) {
    modalEl.style.display = "none";
  }
});
const API_KEY = "7715da1a-3661-41b2-aaff-47e1281cfeb2";
const API_URL_POPULAR = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=1';
const API_URL_POPULAR_PAGINATION = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=';
const API_URL_POPULAR_INFO = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
const API_URL_SEARCH = 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=';

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
  totalPages = respData.pageCount  // создаем новый лист для пагинации из масива который получаю из API
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
   moviesEL.innerHTML = ''
  if(data.items) {                                          //  чтобы работал поискови нужно items поменяь на films
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
} if  (data.films) {
  data.films.forEach((movie) => {
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
        <div class="movie_avereage movie_avereage-${getClassByRate(movie.rating)}">${movie.rating}</div>
      </div>
    `;
    movieEL.addEventListener("click", () => OpenModal(movie.filmId));
    moviesEL.appendChild(movieEL);
  });
}
  // отображение кнопки пагинации 
  
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");

  prevButton.addEventListener("click", previousPage);
  nextButton.addEventListener("click", nextPage);
}


const modalEl = document.querySelector(".modal");

// Модальное окно

async function OpenModal(id) {

  if (!id) {
    console.error("Ошибка: значение id не определено");
    return;
  } // проверка на ошибку id фильма

  const resp = await fetch(API_URL_POPULAR_INFO + id, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
   
  });


  if (!resp.ok) {
    console.error("Ошибка при выполнении запроса к API");
    return;
  } // проверка на ошибку id фильма

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
        <li>Сайт: <a class="modal_saite" href="${respData.webUrl}">${respData.webUrl}</a></li>
        <li class="modal_infotmation" >${respData.description}</li>
      </ul>
      <button type="button" class="modal_button">Закрыть</button>
    </div>
  `;
  modalEl.style.display = "block";
  console.log(respData.webUrl)
}

//  закрытие модального окна 

modalEl.addEventListener("click", (event) => {
  if (
    event.target.classList.contains("modal_button") ||
    !event.target.closest(".modal_cart")
  ) {
    modalEl.style.display = "none";
  }
});

// Поисковик 
const form = document.querySelector('form');
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const headerSearchInput = document.querySelector('.header_search');
  const keyword = encodeURIComponent(headerSearchInput.value);
  const url = API_URL_SEARCH + keyword;
  if (keyword) {
    getMovies(url);
  }
  headerSearchInput.value = ''
});

// Пагинация 
let currentPage = 1

function previousPage() {
  if (currentPage > 1 ) {
    currentPage--
    const url = API_URL_POPULAR_PAGINATION + currentPage
    getMovies(url)
  }
}

function nextPage() {
  currentPage++
  const url = API_URL_POPULAR_PAGINATION + currentPage
  getMovies(url)
}
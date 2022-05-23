let cardsGridElement = document.getElementById("cardsGrid");
let searchElement = document.getElementById("search");
let scrollTopElement = document.getElementById("scrollTop");

let searchedChar = "";
let characters = [];
let nextPageUrl = "";

let isGettingMoreChars = false;

const WINDOW_OFFSET_HEIGHT = 1300;

searchElement.addEventListener("input", (event) => {
  searchedChar = event.target.value;
});

searchElement.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    resetCharsGrid();

    getCharacters();
  }
});

window.addEventListener("scroll", (event) => {
  let currentScrollPosition = window.scrollY;
  let windowHeight = document.documentElement.scrollHeight;

  if (
    windowHeight - currentScrollPosition < WINDOW_OFFSET_HEIGHT &&
    !isGettingMoreChars
  ) {
    handleInfinteScroll();
  }

  if (currentScrollPosition > 1500) {
    return scrollTopElement.classList.add("visible");
  }

  scrollTopElement.classList.remove("visible");
});

async function getCharacters() {
  const response = await fetch(
    `https://rickandmortyapi.com/api/character?name=${searchedChar}`
  );
  const data = await response.json();

  characters = data.results;
  nextPageUrl = data.info.next;

  renderChars(characters);
}

async function handleInfinteScroll() {
  if (!nextPageUrl) {
    return;
  }

  isGettingMoreChars = true;
  const response = await fetch(nextPageUrl);
  const data = await response.json();
  isGettingMoreChars = false;

  console.log(data);

  characters = data.results;
  nextPageUrl = data.info.next;

  renderChars(characters);
}

function renderChars(charsArray) {
  for (let char of charsArray) {
    let newCard = document.createElement("div");

    newCard.classList.add("card");

    const charStatus = {
      Alive: "",
      Dead: "dead",
      unknown: "unknown",
    };

    newCard.innerHTML = `
      <img src=${char.image} alt="Char image" loading="lazy" />
      <div class="info-container">
        <div>
          <h1 class="char-name">${char.name}</h1>
          <div class="status-species-info">
            <span class="status-ball ${charStatus[char.status]}"></span>
            <h2>${char.status} - ${char.species}</h2>
          </div>
        </div>
        <div class="char-info">
          <h1>Origin:</h1>
          <h2>${char.origin.name}</h2>
        </div>
        <div class="char-info">
          <h1>Last location:</h1>
          <h2>${char.location.name}</h2>
        </div>
      </div>
    `;

    cardsGridElement.appendChild(newCard);
  }
}

function resetCharsGrid() {
  cardsGridElement.innerHTML = "";
}

getCharacters();

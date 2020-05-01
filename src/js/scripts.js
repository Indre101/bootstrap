window.addEventListener("DOMContentLoaded", init);
const images = [
  "image1.jpg",
  "image2.jpg",
  "image3.jpg",
  "image4.jpg",
  "image5.jpg",
];

function init() {
  const HTML = getHTMLElements();
  loadImagesToCrousel(HTML);
  // getArticleData(HTML);
  createSponsorImages(HTML);
  randomActiveSlide(HTML);

  HTML.searchInput.addEventListener("input", () => performMark(event.target));
  pagesNumbers(HTML);
}

function performMark(searchInput) {
  let markInstance = new Mark(document.querySelectorAll("div"));
  const searchText = searchInput.value;
  markInstance.unmark({
    done: function () {
      markInstance.mark(searchText, {});
    },
  });
}

function getHTMLElements() {
  const HTML = {};
  HTML.crouselItemTemplate = document.querySelector(
    ".crousel-item-template"
  ).content;
  HTML.carouselInner = document.querySelector(".carousel-inner");
  HTML.articleCard = document.querySelector(".article-card").content;
  HTML.articles = document.querySelector(".articles");
  HTML.sponsorsList = document.querySelector(".sponsorsList");
  HTML.searchInput = document.querySelector("input");
  HTML.totalPageCount = document.querySelector(".total-page-count");

  HTML.pagination = document.querySelector(".pagination");
  return HTML;
}

function pagesNumbers(HTML) {
  $(".pagination").pagination({
    dataSource: function (done) {
      $.ajax({
        type: "GET",
        url: "./articles.json",
        success: function (response) {
          done(response);
        },
      });
    },

    showLastOnEllipsisShow: true,
    pageSize: 3,
    pageNumber: 1,
    pageRange: 1,
    formatNavigator:
      "<span > Page <%= currentPage %></span> of <%= totalPage %>",
    autoHidePrevious: true,
    autoHideNext: true,
    showNavigator: true,
    beforeSend: function () {
      $(".articles").html(" ");
    },
    callback: function (data, pagination) {
      this.beforeSend();
      const html = data.forEach((article) => handleResponse(article, HTML));
    },
  });
}

function pageNumbers(HTML, data) {
  const cln = HTML.pageNumberTemplate.cloneNode(true);
  cln.querySelector(".page-link").textContent = data;
}

function loadImagesToCrousel(HTML) {
  images.forEach((image) => appendImageItems(image, HTML));
}

function appendImageItems(image, HTML) {
  const crouseltItemCln = HTML.crouselItemTemplate.cloneNode(true);
  crouseltItemCln.querySelector("img").src = `./img/${image}`;
  HTML.carouselInner.appendChild(crouseltItemCln);
}

function randomActiveSlide(HTML) {
  const slides = document.querySelectorAll(".carousel-item");
  const ranodomSlideIndex = Math.floor(Math.random() * slides.length);
  slides[ranodomSlideIndex].classList.add("active");
}

async function getArticleData(HTML) {
  const data = await fetch("./articles.json");
  const response = await data.json();

  response.forEach((article) => {
    handleResponse(article, HTML);
  });
}

function handleResponse(article, HTML) {
  const articleCln = HTML.articleCard.cloneNode(true);
  articleCln.querySelector(".card-title").textContent = article.title;
  articleCln.querySelector(".article-description").textContent =
    article.shortDescription;
  articleCln.querySelector(".extra-text").textContent = article.extraText;

  articleCln.querySelector(
    ".text-small"
  ).textContent = `Posted ${article.date}`;
  articleCln.querySelector(
    ".card-img"
  ).src = `./img/article-img/${article.image}`;

  articleCln
    .querySelector(".collapse")
    .setAttribute("id", `extraText${article.id}`);

  articleCln
    .querySelector("button")
    .setAttribute("aria-controls", `extraText${article.id}`);

  articleCln.querySelector("button").dataset.target = `#extraText${article.id}`;
  const btn = articleCln.querySelector("button");
  let clicked = true;
  btn.addEventListener("click", () => {
    clicked = !clicked;
    btn.textContent = clicked ? "Read less" : "Read more";
  });

  HTML.articles.appendChild(articleCln);
}

function createSponsorImages(HTML) {
  const totalAmountOfSponsors = 14;
  for (let j = 1; j <= totalAmountOfSponsors; j++) {
    displaySponorsLogo(j, HTML);
  }
}

function displaySponorsLogo(counter, HTML) {
  const listItem = document.createElement("li");
  const liClassess = [
    "list-group-item",
    "col-3",
    "col-sm-2",
    "d-flex",
    "align-items-center",
    "p-lg-5",
    "pl-lg-0",
  ];
  listItem.classList.add(listItem.dataset.classess);
  liClassess.forEach((classItem) => listItem.classList.add(classItem));
  const sponsorImg = document.createElement("img");
  sponsorImg.classList.add("img-thumbnail");
  sponsorImg.src = `./img/sponsors/img${counter++}.svg`;
  listItem.appendChild(sponsorImg);
  HTML.sponsorsList.appendChild(listItem);
}

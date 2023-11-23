/*const API_Key = "303a180bba6b483da7090aa3ae3458e8";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

async function fetchNews(query) {
  const res = await fetch(`${url}${query}&apiKey=${API_Key}`);
  const data = await res.json();

  if (data.articles) {
    const maxCards = 8; // Set the maximum number of cards to display
    bindData(data.articles.slice(0, maxCards)); // Slice the array to limit the number of cards
  }
}

function bindData(articles) {
  const cardsNews = document.querySelector(".News");
  const ContainerNews = document.querySelector(".news_container");

  cardsNews.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;
    const CardClone = ContainerNews.cloneNode(true);
    fillDataCard(CardClone, article);
    cardsNews.appendChild(CardClone);
  });
}

function fillDataCard(CardClone, article) {
  const newsImg = CardClone.querySelector(".card-img-top");
  const newsTitle = CardClone.querySelector(".card-title");
  const newsDec = CardClone.querySelector(".card-text");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDec.innerHTML = article.description;
}
*/

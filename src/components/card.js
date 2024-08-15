import { cardTemplate } from "../index.js";

function createCard(cardLink, cardName, cardRemover, cardClicker, likePutter) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  cardElement.querySelector(".card__image").src = cardLink;
  cardElement.querySelector(".card__title").textContent = cardName;

  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", function (evt) {
    cardRemover(cardElement);
    evt.stopPropagation();
  });

  cardElement.addEventListener("click", function () {
    cardClicker(cardLink, cardName);
  });

  const likeButton = cardElement.querySelector(".card__like-button");
  likeButton.addEventListener("click", likePutter);

  return cardElement;
}

function putLike(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
  evt.stopPropagation();
}

function removeCard(cardElement) {
  cardElement.remove();
}

export { createCard, putLike, removeCard };

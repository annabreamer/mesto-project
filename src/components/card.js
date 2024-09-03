import { cardTemplate } from "../index.js";

function createCard(
  cardLink,
  cardName,
  cardRemover,
  cardClicker,
  likePutter,
  likes
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikesNumber = cardElement.querySelector(".card__likes-number");
  cardImage.src = cardLink;
  cardImage.alt = cardName;
  cardTitle.textContent = cardName;
  cardLikesNumber.textContent = likes.length;

  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", function (evt) {
    cardRemover(cardElement);
    evt.stopPropagation();
  });

  cardElement.addEventListener("click", function () {
    cardClicker(cardLink, cardName);
  });

  const likeButton = cardElement.querySelector(".card__like-button");
  likeButton.addEventListener("click", function (evt) {
    likePutter(evt, cardLikesNumber);
  });

  return cardElement;
}

function putLike(evt, cardLikesNumber) {
  evt.target.classList.toggle("card__like-button_is-active");
  let likeCount = parseInt(cardLikesNumber.textContent);

  if (evt.target.classList.contains("card__like-button_is-active")) {
    likeCount += 1;
  } else {
    likeCount -= 1;
  }

  cardLikesNumber.textContent = likeCount;

  evt.stopPropagation();
}

function removeCard(cardElement) {
  cardElement.remove();
}

export { createCard, putLike, removeCard };

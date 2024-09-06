import { deleteCard, putLike, removeLike } from "./api.js";

function createCard(
  cardTemplate,
  cardLink,
  cardName,
  cardRemover,
  cardClicker,
  likePutter,
  likes,
  cardId,
  userId,
  currentUserId
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikesNumber = cardElement.querySelector(".card__likes-number");
  const likeButton = cardElement.querySelector(".card__like-button");
  cardImage.src = cardLink;
  cardImage.alt = cardName;
  cardTitle.textContent = cardName;
  cardLikesNumber.textContent = likes.length;

  if (likes.some((user) => user._id === currentUserId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  const deleteButton = cardElement.querySelector(".card__delete-button");
  if (userId === currentUserId) {
    deleteButton.addEventListener("click", function (evt) {
      cardRemover(cardElement, cardId);
      evt.stopPropagation();
    });
  } else {
    deleteButton.remove();
  }

  cardElement.addEventListener("click", function () {
    cardClicker(cardLink, cardName);
  });

  likeButton.addEventListener("click", function (evt) {
    likePutter(evt, cardLikesNumber, cardId);
  });

  return cardElement;
}

function setLike(evt, cardLikesNumber, cardId) {
  if (evt.target.classList.contains("card__like-button_is-active")) {
    removeLike(cardId)
      .then((card) => {
        evt.target.classList.remove("card__like-button_is-active");
        cardLikesNumber.textContent = card.likes.length;
      })
      .catch((err) => {
        console.error(`Ошибка: ${err}`);
      });
  } else {
    putLike(cardId)
      .then((card) => {
        evt.target.classList.add("card__like-button_is-active");
        cardLikesNumber.textContent = card.likes.length;
      })
      .catch((err) => {
        console.error(`Ошибка: ${err}`);
      });
  }

  evt.stopPropagation();
}

function removeCard(cardElement, cardId) {
  return deleteCard(cardId).then(() => {
    cardElement.remove();
  });
}

export { createCard, setLike, removeCard };

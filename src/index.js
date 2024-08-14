import "../pages/index.css";
import { initialCards } from "../scripts/cards.js";

const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");
const popupImage = document.querySelector(".popup_type_image");

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

function openImagePopup(cardLink, cardName) {
  popupImage.querySelector(".popup__image").src = cardLink;
  popupImage.querySelector(".popup__caption").textContent = cardName;
  popupImage.classList.add("popup_is-animated");
  setTimeout(function() {
    popupImage.classList.add("popup_is-opened");
  }, 0);
}

function putLike(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
  evt.stopPropagation();
}

function removeCard(cardElement) {
  cardElement.remove();
}

initialCards.forEach(function (card) {
  const cardElement = createCard(card.link, card.name, removeCard, openImagePopup, putLike);
  placesList.append(cardElement);
});

const buttonEdit = document.querySelector(".profile__edit-button");
const popupEdit = document.querySelector(".popup_type_edit");
buttonEdit.addEventListener("click", function () {
  popupEdit.classList.add("popup_is-animated");
  setTimeout(function() {
    popupEdit.classList.add("popup_is-opened");
  }, 0);
});

const buttonAdd = document.querySelector(".profile__add-button");
const popupNewCard = document.querySelector(".popup_type_new-card");
buttonAdd.addEventListener("click", function () {
  popupNewCard.classList.add("popup_is-animated");
  setTimeout(function() {
    popupNewCard.classList.add("popup_is-opened");
  }, 0);
});

const popups = document.querySelectorAll(".popup");
popups.forEach(function (popup) {
  popup.addEventListener("click", function (evt) {
    if (evt.target === popup) {
      popup.classList.remove("popup_is-opened");
    }
  });

  const popupCloseButton = popup.querySelector(".popup__close");
  popupCloseButton.addEventListener("click", function (evt) {
    popup.classList.remove("popup_is-opened");
  });
});

document.addEventListener("keydown", function (evt) {
  if (evt.key === "Escape") {
    popups.forEach(function (popup) {
      popup.classList.remove("popup_is-opened");
    });
  }
});

const formElement = document.forms["edit-profile"];

const nameInput = formElement.elements.name;
const jobInput = formElement.elements.description;

function handleFormSubmit(evt) {
  evt.preventDefault();

  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

  const profileName = document.querySelector(".profile__title");
  const profileJob = document.querySelector(".profile__description");

  profileName.textContent = nameValue;
  profileJob.textContent = jobValue;
}

formElement.addEventListener("submit", handleFormSubmit);

const formCard = document.forms["new-place"];

const placeInput = formCard.elements["place-name"];
const linkInput = formCard.elements.link;

function cardFormSubmit(evt) {
  evt.preventDefault();

  const placeValue = placeInput.value;
  const linkValue = linkInput.value;

  const newCard = createCard(linkValue, placeValue, removeCard, openImagePopup, putLike);

  placesList.prepend(newCard);

  popupNewCard.classList.remove("popup_is-opened");

  formCard.reset();
}

formCard.addEventListener("submit", cardFormSubmit);

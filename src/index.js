import "../pages/index.css";
import { initialCards } from "../scripts/cards.js";
import { createCard, putLike, removeCard } from "./components/card.js";
import {
  openModal,
  closeModal,
  popupOverlayClickListener,
  popupCloseButtonClickListener,
  escapeKeyListener,
} from "./components/modal.js";

export const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");
const popupImage = document.querySelector(".popup_type_image");

function openImagePopup(cardLink, cardName) {
  popupImage.querySelector(".popup__image").src = cardLink;
  popupImage.querySelector(".popup__caption").textContent = cardName;
  openModal(popupImage);
}

initialCards.forEach(function (card) {
  const cardElement = createCard(
    card.link,
    card.name,
    removeCard,
    openImagePopup,
    putLike
  );
  placesList.append(cardElement);
});

const buttonEdit = document.querySelector(".profile__edit-button");
const popupEdit = document.querySelector(".popup_type_edit");
buttonEdit.addEventListener("click", function () {
  openModal(popupEdit);
});

const buttonAdd = document.querySelector(".profile__add-button");
const popupNewCard = document.querySelector(".popup_type_new-card");
buttonAdd.addEventListener("click", function () {
  openModal(popupNewCard);
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

  closeModal(popupEdit);
}

formElement.addEventListener("submit", handleFormSubmit);

const formCard = document.forms["new-place"];

const placeInput = formCard.elements["place-name"];
const linkInput = formCard.elements.link;

function cardFormSubmit(evt) {
  evt.preventDefault();

  const placeValue = placeInput.value;
  const linkValue = linkInput.value;

  const newCard = createCard(
    linkValue,
    placeValue,
    removeCard,
    openImagePopup,
    putLike
  );

  placesList.prepend(newCard);

  closeModal(popupNewCard);

  formCard.reset();
}

formCard.addEventListener("submit", cardFormSubmit);

export const popups = document.querySelectorAll(".popup");
popups.forEach(function (popup) {
  popup.addEventListener("click", popupOverlayClickListener);

  const popupCloseButton = popup.querySelector(".popup__close");
  popupCloseButton.addEventListener("click", popupCloseButtonClickListener);
});

document.addEventListener("keydown", escapeKeyListener);

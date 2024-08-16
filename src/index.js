import "./pages/index.css";
import { initialCards } from "./scripts/cards.js";
import { createCard, putLike, removeCard } from "./components/card.js";
import {
  openModal,
  closeModal,
  popupOverlayClickListener,
  popupCloseButtonClickListener,
} from "./components/modal.js";

export const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");

const popupImage = document.querySelector(".popup_type_image");
const imagePopup = popupImage.querySelector(".popup__image");
const imageCaption = popupImage.querySelector(".popup__caption");

const buttonEdit = document.querySelector(".profile__edit-button");
const popupEdit = document.querySelector(".popup_type_edit");

const buttonAdd = document.querySelector(".profile__add-button");
const popupNewCard = document.querySelector(".popup_type_new-card");

const formElement = document.forms["edit-profile"];
const nameInput = formElement.elements.name;
const jobInput = formElement.elements.description;

const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");

const formCard = document.forms["new-place"];
const placeInput = formCard.elements["place-name"];
const linkInput = formCard.elements.link;

const popups = document.querySelectorAll(".popup");

function openImagePopup(cardLink, cardName) {
  imagePopup.src = cardLink;
  imageCaption.textContent = cardName;
  imagePopup.alt = cardName;
  openModal(popupImage);
}

function handlePopupEditFormSubmit(evt) {
  evt.preventDefault();

  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

  profileName.textContent = nameValue;
  profileJob.textContent = jobValue;

  closeModal(popupEdit);
}

function submitCardForm(evt) {
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

buttonEdit.addEventListener("click", function () {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;

  openModal(popupEdit);
});

buttonAdd.addEventListener("click", function () {
  openModal(popupNewCard);
});

formElement.addEventListener("submit", handlePopupEditFormSubmit);

formCard.addEventListener("submit", submitCardForm);

popups.forEach(function (popup) {
  popup.addEventListener("click", popupOverlayClickListener);

  const popupCloseButton = popup.querySelector(".popup__close");
  popupCloseButton.addEventListener("click", popupCloseButtonClickListener);
});

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

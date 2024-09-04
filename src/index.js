import "./pages/index.css";
import { initialCards } from "./scripts/cards.js";
import { createCard, putLike, removeCard } from "./components/card.js";
import {
  openModal,
  closeModal,
  popupOverlayClickListener,
  popupCloseButtonClickListener,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  postCard,
} from "./components/api.js";

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

const popupConfirm = document.querySelector(".popup_type_confirmation");
const confirmationButton = popupConfirm.querySelector(".popup__agree");

let cardToDelete, userId;

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

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

  updateUserInfo(nameValue, jobValue)
    .then((userInfo) => {
      profileName.textContent = userInfo.name;
      profileJob.textContent = userInfo.about;
      closeModal(popupEdit);
    })
    .catch((err) => {
      console.error(`Ошибка: ${err}`);
    });
}

function submitCardForm(evt) {
  evt.preventDefault();

  const placeValue = placeInput.value;
  const linkValue = linkInput.value;

  postCard(linkValue, placeValue)
    .then((card) => {
      const newCard = createCard(
        linkValue,
        placeValue,
        removeCardWithConfirmation,
        openImagePopup,
        putLike,
        card.likes,
        card._id,
        card.owner._id,
        userId
      );

      placesList.prepend(newCard);

      closeModal(popupNewCard);

      formCard.reset();
    })
    .catch((err) => {
      console.error(`Ошибка: ${err}`);
    });
}

buttonEdit.addEventListener("click", function () {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  clearValidation(formElement, validationConfig);

  openModal(popupEdit);
});

buttonAdd.addEventListener("click", function () {
  placeInput.value = "";
  linkInput.value = "";
  clearValidation(formCard, validationConfig);

  openModal(popupNewCard);
});

formElement.addEventListener("submit", handlePopupEditFormSubmit);

formCard.addEventListener("submit", submitCardForm);

popups.forEach(function (popup) {
  popup.addEventListener("click", popupOverlayClickListener);

  const popupCloseButton = popup.querySelector(".popup__close");
  popupCloseButton.addEventListener("click", popupCloseButtonClickListener);
});

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userInfo, cards]) => {
    profileName.textContent = userInfo.name;
    profileJob.textContent = userInfo.about;
    userId = userInfo._id;

    cards.forEach(function (card) {
      const cardElement = createCard(
        card.link,
        card.name,
        removeCardWithConfirmation,
        openImagePopup,
        putLike,
        card.likes,
        card._id,
        card.owner._id,
        userId
      );
      placesList.append(cardElement);
    });
  })
  .catch((err) => {
    console.error(`Ошибка: ${err}`);
  });

enableValidation(validationConfig);

function removeCardWithConfirmation(cardElement, cardId) {
  cardToDelete = { cardElement, cardId };
  openModal(popupConfirm);
}

confirmationButton.addEventListener("click", () => {
  if (cardToDelete) {
    removeCard(cardToDelete.cardElement, cardToDelete.cardId).then(function () {
      cardToDelete = null;
      closeModal(popupConfirm);
    });
  }
});

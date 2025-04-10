import "./pages/index.css";
import { createCard, setLike, removeCard } from "./components/card.js";
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
  editAvatar,
} from "./components/api.js";

const cardTemplate = document.querySelector("#card-template").content;
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
const saveProfileButton = formElement.querySelector(".popup__button");

const profileName = document.querySelector(".profile__title");
const profileJob = document.querySelector(".profile__description");

const formCard = document.forms["new-place"];
const placeInput = formCard.elements["place-name"];
const linkInput = formCard.elements.link;
const saveCardButton = formCard.querySelector(".popup__button");

const popups = document.querySelectorAll(".popup");

const popupConfirm = document.querySelector(".popup_type_confirmation");
const confirmationButton = popupConfirm.querySelector(".popup__agree");

const popupAvatar = document.querySelector(".popup_type_avatar");
const formAvatar = document.forms["edit-avatar"];
const avatarInput = formAvatar.elements.link;
const profileImage = document.querySelector(".profile__image");
const avatarEditIcon = document.querySelector(".avatar__overlay");
const saveAvatarButton = formAvatar.querySelector(".popup__button");

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
  setButtonText(saveProfileButton, true);

  updateUserInfo(nameValue, jobValue)
    .then((userInfo) => {
      profileName.textContent = userInfo.name;
      profileJob.textContent = userInfo.about;
      closeModal(popupEdit);
    })
    .catch((err) => {
      console.error(`Ошибка: ${err}`);
    })
    .finally(() => {
      setButtonText(saveProfileButton, false);
    });
}

function submitCardForm(evt) {
  evt.preventDefault();

  const placeValue = placeInput.value;
  const linkValue = linkInput.value;
  setButtonText(saveCardButton, true);

  postCard(linkValue, placeValue)
    .then((card) => {
      const newCard = createCard(
        cardTemplate,
        linkValue,
        placeValue,
        removeCardWithConfirmation,
        openImagePopup,
        setLike,
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
    })
    .finally(() => {
      setButtonText(saveCardButton, false);
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
    profileImage.style.backgroundImage = `url(${userInfo.avatar})`;
    userId = userInfo._id;

    cards.forEach(function (card) {
      const cardElement = createCard(
        cardTemplate,
        card.link,
        card.name,
        removeCardWithConfirmation,
        openImagePopup,
        setLike,
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
    removeCard(cardToDelete.cardElement, cardToDelete.cardId)
      .then(function () {
        cardToDelete = null;
        closeModal(popupConfirm);
      })
      .catch((err) => {
        console.error(`Ошибка: ${err}`);
      });
  }
});

avatarEditIcon.addEventListener("click", () => {
  openModal(popupAvatar);
});

formAvatar.addEventListener("submit", (event) => {
  event.preventDefault();
  const avatar = avatarInput.value;
  setButtonText(saveAvatarButton, true);

  editAvatar(avatar)
    .then((data) => {
      profileImage.style.backgroundImage = `url(${data.avatar})`;
      closeModal(popupAvatar);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setButtonText(saveAvatarButton, false);
    });
});

function setButtonText(button, isLoading) {
  if (isLoading) {
    button.textContent = "Сохранение...";
    button.classList.add("button_saving");
  } else {
    button.textContent = "Сохранить";
    button.classList.remove("button_saving");
  }
}

import "../pages/index.css";
import { initialCards } from "../scripts/cards.js";

const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");
const popupImage = document.querySelector(".popup_type_image");

function createCard(cardLink, cardName, cardRemover) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  cardElement.querySelector(".card__image").src = cardLink;
  cardElement.querySelector(".card__title").textContent = cardName;

  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", function (evt) {
    cardRemover(cardElement);
    evt.stopPropagation();
  });

  cardElement.addEventListener("click", function () {
    popupImage.classList.add("popup_is-opened");
  });

  return cardElement;
}

function removeCard(cardElement) {
  cardElement.remove();
}

initialCards.forEach(function (card) {
  const cardElement = createCard(card.link, card.name, removeCard);
  placesList.append(cardElement);
});

const buttonEdit = document.querySelector(".profile__edit-button");
const popupEdit = document.querySelector(".popup_type_edit");
buttonEdit.addEventListener("click", function () {
  popupEdit.classList.add("popup_is-opened");
});

const buttonAdd = document.querySelector(".profile__add-button");
const popupNewCard = document.querySelector(".popup_type_new-card");
buttonAdd.addEventListener("click", function () {
  popupNewCard.classList.add("popup_is-opened");
});

const popups = document.querySelectorAll(".popup");
popups.forEach(function(popup) {
  popup.addEventListener("click", function(evt) {
    if (evt.target === popup) {
      popup.classList.remove("popup_is-opened");
    };
  });

  const popupCloseButton = popup.querySelector(".popup__close");
  popupCloseButton.addEventListener("click", function(evt) {
    popup.classList.remove("popup_is-opened");
  });
});

document.addEventListener("keydown", function(evt) {
  if (evt.key === 'Escape') {
    popups.forEach(function(popup) {
      popup.classList.remove("popup_is-opened");
    });
  }
});

// Находим форму в DOM
const formElement = document.forms["edit-profile"];
// Находим поля формы в DOM
const nameInput = formElement.elements.name;
const jobInput = formElement.elements.description;

// Обработчик «отправки» формы, хотя пока
// она никуда отправляться не будет
function handleFormSubmit(evt) {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.
  // Так мы можем определить свою логику отправки.
  // О том, как это делать, расскажем позже.

  // Получите значение полей jobInput и nameInput из свойства value
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;
  // Выберите элементы, куда должны быть вставлены значения полей
  const profileName = document.querySelector(".profile__title");
  const profileJob = document.querySelector(".profile__description");
  // Вставьте новые значения с помощью textContent
  profileName.textContent = nameValue;
  profileJob.textContent = jobValue;
}

// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
formElement.addEventListener("submit", handleFormSubmit);

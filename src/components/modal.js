import { popups } from "../index.js";

function openModal(popup) {
  popup.classList.add("popup_is-opened");
}

function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
}

function popupOverlayClickListener(evt) {
  if (evt.target.classList.contains("popup")) {
    closeModal(evt.target);
  }
}

function popupCloseButtonClickListener(evt) {
  closeModal(evt.target.closest(".popup"));
}

function escapeKeyListener(evt) {
  if (evt.key === "Escape") {
    popups.forEach(function (popup) {
      closeModal(popup);
    });
  }
}

export {
  openModal,
  closeModal,
  popupOverlayClickListener,
  popupCloseButtonClickListener,
  escapeKeyListener,
};

function openModal(popup) {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", escapeKeyListener);
}

function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", escapeKeyListener);
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
    const openPopup = document.querySelector(".popup_is-opened");
    if (openPopup) {
      closeModal(openPopup);
    }
  }
}

export {
  openModal,
  closeModal,
  popupOverlayClickListener,
  popupCloseButtonClickListener,
};

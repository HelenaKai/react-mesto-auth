import { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({
  isOpen,
  onClose,
  onAddPlace,
  isLoading,
  buttonState,
  onValidate,
  errorMessage,
}) {
  const [cardName, setCardName] = useState("");
  const [cardLink, setCardLink] = useState("");

  useEffect(() => {
    setCardName("");
    setCardLink("");
  }, [isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onAddPlace({
      name: cardName,
      link: cardLink,
    });
  }

  function hundleChangeCardName(evt) {
    setCardName(evt.target.value);
  }

  function hundleChangeCardLink(evt) {
    setCardLink(evt.target.value);
  }

  return (
    <PopupWithForm
      name="place"
      title="Новое место"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonState={buttonState}
      onValidate={onValidate}
      buttonText={isLoading ? `Сохранение` : `Создать`}
    >
      <label className="popup__input-wrap">
        <input
          id="input-img-title"
          className="popup__input popup__input_type_name popup__input_img-title"
          type="text"
          name="name"
          placeholder="Название места"
          value={cardName || ""}
          onChange={hundleChangeCardName}
          minLength="2"
          maxLength="30"
          required
        />
        <span className="popup__input-error input-img-title-error">
          {errorMessage.name && errorMessage.name}
        </span>
      </label>

      <label className="popup__input-wrap">
        <input
          id="input-url"
          className="popup__input popup__input_type_about popup__input-url"
          type="url"
          name="link"
          placeholder="Ссылка на изображение"
          value={cardLink || ""}
          onChange={hundleChangeCardLink}
          required
        />
        <span className="popup__input-error input-url-error">
          {errorMessage.link && errorMessage.link}
        </span>
      </label>
    </PopupWithForm>
  );
}

export default AddPlacePopup;

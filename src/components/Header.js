import React from "react";
import logo from "../images/mesto-logo.svg";

function Header(props) {

  function handleClick() {
    props.loggedIn ? props.logOut() : props.onTogglePage();
  }

  return (
    <header className="header">
      <img
        className="header__logo"
        src={logo}
        alt="Логотип интерактивного сервиса Mesto Russia"
      />

      <div className="header__info">
        {props.loggedIn && <p className="header__email">{props.userEmail}</p>}

        <button
          className="header__link header__button-logout"
          onClick={handleClick}
        >
          {props.loggedIn ? "Выйти" : props.btnText}
        </button>
      </div>
    </header>
  );
}

export default Header;

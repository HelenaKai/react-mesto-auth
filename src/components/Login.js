import React from "react";
import { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleChangeEmail(e) {
    setEmail(e.target.value);
  }
  function handleChangePassword(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onLogin({ email, password });
  }

  return (
    <section className="auth">
      <h2 className="auth__title">Вход</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <label className="auth__label">
          <input
            type="email"
            name="email"
            value={email}
            className="auth__input"
            placeholder="Email"
            required
            onChange={handleChangeEmail}
          />
          <input
            type="password"
            name="password"
            value={password}
            className="auth__input"
            placeholder="Пароль"
            minLength="2"
            maxLength="30"
            required
            onChange={handleChangePassword}
          />
        </label>
        <button className="auth__submit">Войти</button>
      </form>
    </section>
  );
}

export default Login;

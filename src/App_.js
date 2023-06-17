import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';

import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip';

import api from '../utils/Api';
import * as auth from '../utils/auth';
/* import {checkToken, login, register} from '../utils/auth'; */

import { CurrentUserContext } from '../contexts/CurrentUserContext';


function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);      // попап редактирования
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);            // попап добавления место
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);        // попап аватара
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [isInfoTooltipPopup, setIsInfoTooltipPopup] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  const [userEmail, setUserEmail] = useState('');
  const [userPwd, setUserPwd] = useState('');


  //задание текста кнопки header'а 
  const [headerBtnText, setHeaderBtnText] = useState('Регистрация');

  //задание текста кнопки сохранения
  const [submitBtnText, setSubmitBtnText] = useState('Войти');

  //функция для изменения текста кнопки при отправке данных
  function changeSubmitBtnText(text) {
    setSubmitBtnText(text);
  };

  //Переменная состояния для карточек
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});
  const [dataDeleteCard, setDataDeleteCard] = useState({});

  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState({});
  const [buttonState, setButtonState] = useState(true);

  const handlePopupElement =
    isEditProfilePopupOpen ||
    isAddPlacePopupOpen ||
    isEditAvatarPopupOpen ||
    isImagePopupOpen ||
    isConfirmDeletePopupOpen  ||
    isInfoTooltipPopup;
   

  // --------закрытие по ESC и оверлею
  useEffect(() => {
    function handleEscClose(evt) {
      if (evt.key === "Escape") {
        closeAllPopups();
      }
    }
    const handleClick = (evt) => {
      if (evt.target.classList.contains("popup_opened")) {
        closeAllPopups();
      }
    };

    if (handlePopupElement) {
      document.addEventListener("keydown", handleEscClose);
      document.addEventListener("mousedown", handleClick);
      return () => {
        document.removeEventListener("keydown", handleEscClose);
        document.removeEventListener("mousedown", handleClick);
      };
    }
  }, [handlePopupElement]);



  //---------------------------------------------------------
 useEffect(() => {
  loggedIn && 
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([userInfo, initialCards]) => {
        setCurrentUser(userInfo);
        setCards(initialCards);
      })
      .catch((err) => {
        console.log(err);
       /*  handleInfoTooltip(false);  */
      });
  }, [loggedIn]);  


  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);
  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);

  // -------- Открыте изображение
  const handleCardClick = (card) => {
    setSelectedCard(card);
    setImagePopupOpen(true);
  };

  const handleCardDeleteClick = (card) => {
    setDataDeleteCard(card);
    setIsConfirmDeletePopupOpen(true);
  };

  //  --------- закрытие всех попапов
  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setImagePopupOpen(false);
    setIsConfirmDeletePopupOpen(false);
    setIsInfoTooltipPopup(false);
  };


//----------------------------------------------------------------------------
//функция отправки жетона для аутентификации

  function checkToken() {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          if (res && res.data) {
            setLoggedIn(true);
            setUserEmail(res.data.emaill);
            navigate("/");
          }
        })
        .catch((err) => {
          console.log('Внутренняя ошибка: ', err);
          setLoggedIn(false);
          /*  handleInfoTooltip(false); */
        });
    }
  }
  useEffect(() => {
    checkToken();

   // eslint-disable-next-line 
  }, []);


   //функция отправки данных для авторизации и обработки ответа

   function handleLogin(loginData) {
    auth
      .login(loginData)
      .then((res) => {
        localStorage.setItem('jwt', res.token);
        setUserEmail(loginData.email);
        setLoggedIn(true);
        navigate("/");
      })
      .catch((err) => {
        console.log('Внутренняя ошибка: ', err);  
        setIsInfoTooltipPopup(true);    
        /* handleInfoTooltip(); */
      });
  };
 



  //функция отправки данных на регистрацию и обработки ответа

  function handleRegister(email, password) {
    auth.register(email, password)
      .then(() => {
        setRegSuccess(true);
        setIsInfoTooltipPopup(true);
        setUserEmail(email);
        setUserPwd(password);
        navigate('/sign-in')
      })
      .catch(err => {
        setRegSuccess(false);
        setIsInfoTooltipPopup(true);
        console.log('Внутренняя ошибка: ', err);
      })
  };


 //функция обработки выхода с сайта
 function logOut() {
  localStorage.removeItem('jwt');
  setSubmitBtnText('Войти');
  setUserEmail('');
  setUserPwd('');
  setLoggedIn(false);
  navigate("/sign-in");
};


  // Api------- Изменение данных пользователя
  const handleUpdateUser = (data) => {
    setIsLoading(true);
    api
      .changeUserInfo(data)
      .then((newUser) => {
        setCurrentUser(newUser);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
       /*  handleInfoTooltip(false); */
      })
      .finally(() => setIsLoading(false));
  };

  // Api-------- Изменение аватара
  const handleUpdateAvatar = (avatar) => {
    setIsLoading(true);
    api
      .changeUserAvatar(avatar)
      .then((newAvatar) => {
        setCurrentUser(newAvatar);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      /*   handleInfoTooltip(false); */
      })
      .finally(() => setIsLoading(false));
  };

  // Api--------Like
  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((error) => {
        console.log(error);
      /*   handleInfoTooltip(false); */
      });
  }

  // Api----- Обработчик подтверждения удаления карточки
  const handleCardDelete = (card) => {
    setIsLoading(true);
    api
      .deleteCard(card._id)
      .then((newCard) => {
        const newCards = cards.filter((c) =>
          c._id === card._id ? "" : newCard
        );
        setCards(newCards);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      /*   handleInfoTooltip(false); */
      })
      .finally(() => setIsLoading(false));
  };

  // Api----- Добавление карточки
  const handleAddPlaceSubmit = (card) => {
    setIsLoading(true);
    api
      .addCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      /*   handleInfoTooltip(false); */
      })
      .finally(() => setIsLoading(false));
  };


  function checkInputValidity(evt) {
    if (!evt.currentTarget.checkValidity()) {
      setErrorMessage({
        ...errorMessage,
        [evt.target.name]: evt.target.validationMessage,
      });
      setButtonState(true);
    } else {
      setErrorMessage({});
      setButtonState(false);
    }
  }

  useEffect(() => {
    setErrorMessage({});
    setButtonState(true);
  }, [isEditProfilePopupOpen, isAddPlacePopupOpen, isEditAvatarPopupOpen]);

//-------------------------------------------------------------------------------

//функция переключения страницы
function handleTogglePage() {
  if (location.pathname === '/sign-in') {
    navigate('/sign-up')
    setHeaderBtnText('Вход')
    return;
  }
  navigate('/sign-in')
  setHeaderBtnText('Регистрация')
};


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header 
            loggedIn={loggedIn} 
            userEmail={userEmail} 
            btnText={headerBtnText}
            onTogglePage={handleTogglePage}
            logOut={logOut} 
        />

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                element={Main}
                loggedIn={loggedIn}
                cards={cards}
                onEditAvatar={handleEditAvatarClick}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDeleteClick}
              />
            }
          />

          <Route
            path="/sign-up"
            element={
              <Register 
                onRegister={handleRegister} 
                btnText='Зарегистрироваться'
                onTogglePage={handleTogglePage}
                
              />
            }
          />

          <Route 
            path="/sign-in" 
            element={
              <Login 
                onLogin={handleLogin}
                email={userEmail}
                password={userPwd} 
                btnText={submitBtnText}
                changeBtnText={changeSubmitBtnText}
              />
            } 
          />

          <Route path="*" element={
            <Navigate to='/' replace />}
          />

        </Routes>

        <Footer date={new Date().getFullYear()} loggedIn={loggedIn} />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={isLoading}
          onValidate={checkInputValidity}
          buttonState={buttonState}
          errorMessage={errorMessage}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoading={isLoading}
          onValidate={checkInputValidity}
          buttonState={buttonState}
          errorMessage={errorMessage}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={isLoading}
          onValidate={checkInputValidity}
          buttonState={buttonState}
          errorMessage={errorMessage}
        />

        <ConfirmDeletePopup
          isOpen={isConfirmDeletePopupOpen}
          onClose={closeAllPopups}
          isLoading={isLoading}
          onSubmit={handleCardDelete}
          card={dataDeleteCard}
        />

        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        />

        <InfoTooltip
          name="tooltip"
          isOpen={isInfoTooltipPopup}
          onClose={closeAllPopups}
          isSignIn={regSuccess}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;


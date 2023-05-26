import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import '../styles/Contact.css';

const Contact = () => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isNameValid, setIsNameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isMessageValid, setIsMessageValid] = useState(true);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsNameValid(validateName(name));
    setIsEmailValid(validateEmail(email));
    setIsMessageValid(validateMessage(message));

    if (isNameValid && isEmailValid && isMessageValid) {
      setIsFormSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');

      setTimeout(() => {
        setIsFormSubmitted(false);
      }, 4000);
    }
  };

  const validateName = (name) => {
    // Vérification de la validité du nom (ex: non vide, pas de caractères spéciaux, etc.)
    // Retourne true si le nom est valide, sinon false
    return name !== '';
  };

  const validateEmail = (email) => {
    // Vérification de la validité de l'email (ex: format, domaine, etc.)
    // Retourne true si l'email est valide, sinon false
    return email !== '';
  };

  const validateMessage = (message) => {
    // Vérification de la validité du message (ex: longueur minimale, contenu spécifique, etc.)
    // Retourne true si le message est valide, sinon false
    return message !== '';
  };

  return (
    <div className="contact-container">
      <div className="contact-form">
        <h2>Contactez-nous</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
            {!isNameValid && <p className="error-message">Veuillez entrer un nom valide.</p>}
          </div>
          <div className="form-group">
            <input type="email" placeholder="Adresse e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
            {!isEmailValid && <p className="error-message">Veuillez entrer une adresse e-mail valide.</p>}
          </div>
          <div className="form-group">
            <textarea rows="5" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
            {!isMessageValid && <p className="error-message">Veuillez entrer un message valide.</p>}
          </div>
          <button type="submit">Envoyer</button>
          {(isFormSubmitted && isNameValid && isEmailValid && isMessageValid) && <p className="success-message">Message envoyé avec succès!</p>}
        </form>
      </div>

      <div className="contact-info">
        <div className="info-item">
          <FontAwesomeIcon icon={faEnvelope} />
          <p>foodpoints@gmail.com</p>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faPhone} />
          <p>+212-615451345</p>
        </div>
        <div className="info-item">
          <FontAwesomeIcon icon={faMapMarker} />
          <p>El-jadida, Maroc</p>
        </div>
      </div>
      <div className="social-icons">
        <a href="https://www.facebook.com" target="_blank"><FontAwesomeIcon icon={faFacebook} /></a>
        <a href="https://www.twitter.com" target="_blank"><FontAwesomeIcon icon={faTwitter} /></a>
        <a href="https://www.instagram.com" target="_blank"><FontAwesomeIcon icon={faInstagram} /></a>
      </div>
    </div>
  );
};

export default Contact;

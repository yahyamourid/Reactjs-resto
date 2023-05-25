import React from 'react'
import Header from './components/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Accueil from './components/Accueil';
import Apropos from './components/Apropos';
import Contact from './components/Contact';

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <div>
      <Routes  className="content-container">
        <Route path="/" element={<Accueil />} />
        <Route path="/apropos" element={<Apropos />} />
        <Route path="/contact" element={<Contact />} />


      </Routes>
      </div>
    </div>
  )
}

export default App

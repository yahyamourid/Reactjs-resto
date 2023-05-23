import React from 'react'
import Header from './components/Header'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Accueil from './components/Accueil';

const App = () => {
  return (
    <div className="app-container">
      <Header />
      <div>
      <Routes  className="content-container">
        <Route path="/" element={<Accueil />} />



      </Routes>
      </div>
    </div>
  )
}

export default App

import { useState } from 'react'
import {  Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import NavBar from '../pages/NavBar.jsx';
export default function App() {
  return (
    <>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/" element={<MoviePage />} />
          <Route path="/suggest" element={<SuggestionPage />} /> */}
        </Routes>
    </>
  )
}



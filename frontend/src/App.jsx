import { useState } from 'react'
import {  Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage.jsx';
import NavBar from '../pages/NavBar.jsx';
import MedicalPage from '../pages/MedicalPage.jsx';
import CarPage from '../pages/CarPage.jsx';
import LifePage from '../pages/lifePage.jsx';
import ProfilePage from '../pages/ProfilePage.jsx';
export default function App() {
  return (
    <>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/medical" element={<MedicalPage />} />
          <Route path="/car" element={<CarPage />} />
          <Route path="/life" element={<LifePage />} />
          <Route path='/profile' element={<ProfilePage />} />
        </Routes>
    </>
  )
}



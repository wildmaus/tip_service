import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './components/pages/Home/Home.jsx';
import Buy from './components/pages/Buy/Buy.jsx';
import Profile from './components/pages/Profile/Profile.jsx';


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='*' element={<Home />} />
        <Route path='/buy' element={<Buy />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

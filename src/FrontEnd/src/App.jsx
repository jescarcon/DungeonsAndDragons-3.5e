//#region Imports
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate,Outlet } from 'react-router-dom';
import './App.css';

import NotFound from './Components/Error/NotFound';
import HomePage from './Components/Main/HomePage/HomePage';
import InitialPage from './Components/Main/InitialPage/InitialPage';
import Login from './Components/Auth/Login/Login';
import Register from './Components/Auth/Register/Register';
import ProtectedRoute from './Components/Auth/ProtectedRoute';
import Navbar from './Components/Main/Navbar/Navbar';

import GameList from './Components/Games/GameList/GameList';
import GameDetails from './Components/Games/GameDetails/GameDetails';
import Diary from './Components/Games/GameDetails/Diary/Diary';
import DiaryEntry from './Components/Games/GameDetails/Diary/Entries/DiaryEntry';
import Notes from './Components/Games/GameDetails/Notes/Notes';
import Tavern from './Components/Games/GameDetails/Tavern/Tavern';

//#endregion

//#region Logica
function Logout(){
  localStorage.clear()
  return <Navigate to="/"/>
}

function RegisterAndLogout(){
  localStorage.clear()
  return <Register/>
}

const ProtectedLayout = () => {
  return (
    <div>
      <Navbar/>
      <Outlet /> {/* Rutas que incluyen Navbar */}
    </div>
  );
};
//#endregion

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* Basic Routes */}
        <Route path="/" element={<InitialPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />

        {/* Protected with Login Routes*/}
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        

          <Route path="/games" element={<ProtectedRoute><GameList/></ProtectedRoute>} />
          <Route path="/games/:pk" element={<ProtectedRoute><GameDetails/></ProtectedRoute>} />
          <Route path="/games/:pk/diary" element={<ProtectedRoute><Diary/></ProtectedRoute>} />
          <Route path="/games/:pk/diaries/:id/entries" element={<ProtectedRoute><DiaryEntry/></ProtectedRoute>} />
          <Route path="/games/:pk/tavern" element={<ProtectedRoute><Tavern/></ProtectedRoute>} />
          <Route path="/games/:pk/notes" element={<ProtectedRoute><Notes/></ProtectedRoute>} />

        </Route>


        {/* Other Routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
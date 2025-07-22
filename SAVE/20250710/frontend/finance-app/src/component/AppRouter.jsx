import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../page/HomePage';
import ListPage from '../page/ReportPage';
import TickerPage from '../page/TickerPage';
import NavBar from './NavBar';
import ErrorPage from '../page/ErrorPage';

function AppRouter () {
  return <>
    <Router>
      <NavBar />
      <Routes>
        {/* Définition des routes */}
        <Route path="/"       element = {<HomePage />} />
        <Route path="/report" element = {<ListPage />} />
        <Route path="/ticker" element = {<TickerPage />} />
        {/* Route par défaut : page d'erreur (la page n'existe pas) */}
        <Route path="/*"      element = {<ErrorPage />} />
      </Routes>
    </Router>
  </>
};

export default AppRouter;

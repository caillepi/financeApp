import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from '../page/HomePage';
import ListPage from '../page/ReportPage';
import TickerPage from '../page/TickerPage';
import NavBar from './NavBar';
import ErrorPage from '../page/ErrorPage';
import LoginPage from '../page/LoginPage';
import { NavigationContextProvider } from '../hook/useNavigation.jsx';

function AppRouter () {
  return <>
    <Router>
      <NavigationContextProvider>
        <NavBar />
        <Routes>
          {/* Définition des routes */}
          <Route path="/"       element = {<HomePage />} />
          <Route path='/login'  element = {<LoginPage />} />
          <Route path="/report" element = {<ListPage />} />
          <Route path="/ticker" element = {<TickerPage />} />
          {/* Route par défaut : page d'erreur (la page n'existe pas) */}
          <Route path="/*"      element = {<ErrorPage />} />
        </Routes>
      </NavigationContextProvider>
    </Router>
  </>
};

export default AppRouter;

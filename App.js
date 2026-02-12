// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminNavbar from './AdminComponents/AdminNavbar';
import HomePage from './Components/HomePage';
import ArticleForm from './AdminComponents/ArticleForm';
import ViewArticle from './AdminComponents/ViewArticle';
import UserViewArticle from './UserComponents/UserViewArticle';
import Login from './Components/Login';
import Signup from './Components/Signup';
import UserNavbar from './UserComponents/UserNavbar';
import PrivateRoute from './Components/PrivateRoute';
import ErrorPage from './Components/ErrorPage';



function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  
  return (
    <BrowserRouter>
      
      <ScrollToTop />

      <Routes>

      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* HOME */}
      <Route path="/home" element={
        <PrivateRoute>
          <HomePage />
        </PrivateRoute>
      } />

      
      <Route path="/articles/new" element={
        <PrivateRoute adminOnly>
          <ArticleForm />
        </PrivateRoute>
      } />

      <Route path="/articles/edit/:id" element={
        <PrivateRoute adminOnly>
          <ArticleForm />
        </PrivateRoute>
      } />

      <Route path="/view" element={
        <PrivateRoute adminOnly>
          <ViewArticle />
        </PrivateRoute>
      } />

      
      <Route path="/userview" element={
        <PrivateRoute>
          <UserViewArticle />
        </PrivateRoute>
      } />

      <Route path="*" element={<ErrorPage />} />

      </Routes>
    </BrowserRouter>
  );
}

import React from 'react';
import { Navigate } from 'react-router-dom';

// Giriş kontrolü zaten ProtectedRoute'ta yapılıyor; burada ek olarak
// sadece "admin" rolündeki hesapların panele erişebilmesi sağlanır.
// (Gerçek veri erişimi Firestore güvenlik kurallarıyla da korunur.)
function AdminRoute({ children }) {
  const isAuthenticated = localStorage.getItem('userLoggedIn');
  const role = localStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (role !== 'admin') {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

export default AdminRoute;

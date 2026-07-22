import OnboardingFlow from './pages/OnboardingFlow';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivacyPolicy from './pages/PrivacyPolicy';
import InfoForm from './pages/InfoForm';
import PreTest from './pages/PreTest';
import Results from './pages/Results';
import AtlasMap from './pages/AtlasMap';
import VitalModule from './pages/VitalModule';
import ExaminationModule from './pages/ExaminationModule';
import ReflexesModule from './pages/ReflexesModule';
import ScalesModule from './pages/ScalesModule';
import Certificate from './pages/Certificate';
import ProtectedRoute from './pages/ProtectedRoute'; // Korumalı rota bileşeni

function App() {
  return (
    <Router>
      <Routes>
        {/* Herkesin erişebileceği genel sayfalar */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingFlow /></ProtectedRoute>} />
        <Route path="/register" element={<Register />} />
       

        {/* Giriş yapılması gereken korumalı sayfalar */}
        <Route path="/info-form" element={<ProtectedRoute><InfoForm /></ProtectedRoute>} />
        <Route path="/pre-test" element={<ProtectedRoute><PreTest /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/atlas-map" element={<ProtectedRoute><AtlasMap /></ProtectedRoute>} />
        <Route path="/vital-module" element={<ProtectedRoute><VitalModule /></ProtectedRoute>} />
        <Route path="/examination-module" element={<ProtectedRoute><ExaminationModule /></ProtectedRoute>} />
        <Route path="/reflexes-module" element={<ProtectedRoute><ReflexesModule /></ProtectedRoute>} />
        <Route path="/scales-module" element={<ProtectedRoute><ScalesModule /></ProtectedRoute>} />
        <Route path="/certificate" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
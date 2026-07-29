import OnboardingFlow from './pages/OnboardingFlow';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FinalTest from './pages/FinalTest';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import InfoForm from './pages/InfoForm';
import PreTest from './pages/PreTest';
import Results from './pages/Results';
import WrongAnswers from './pages/WrongAnswers';
import EducationModules from './pages/EducationModules';
import ModuleHome from './pages/ModuleHome';
import TopicDetail from './pages/TopicDetail';
import ScalesModule from './pages/ScalesModule';
import FinalReport from './pages/FinalReport';
import ThankYou from './pages/ThankYou';
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
        <Route path="/wrong-answers" element={<ProtectedRoute><WrongAnswers /></ProtectedRoute>} />

        {/* Eğitim Modülleri: Level 1 (liste) -> Level 2 (konu listesi / vücut haritası) -> Level 3 (bilgi kartları + video) */}
        <Route path="/education-modules" element={<ProtectedRoute><EducationModules /></ProtectedRoute>} />
        <Route path="/module/:moduleId" element={<ProtectedRoute><ModuleHome /></ProtectedRoute>} />
        <Route path="/module/:moduleId/:topicId" element={<ProtectedRoute><TopicDetail /></ProtectedRoute>} />

        <Route path="/final-test" element={<ProtectedRoute><FinalTest /></ProtectedRoute>} />
        <Route path="/scales-module" element={<ProtectedRoute><ScalesModule /></ProtectedRoute>} />
        <Route path="/final-report" element={<ProtectedRoute><FinalReport /></ProtectedRoute>} />
        <Route path="/thank-you" element={<ProtectedRoute><ThankYou /></ProtectedRoute>} />
        <Route path="/certificate" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

import OnboardingFlow from './pages/OnboardingFlow';
import { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { App as CapApp } from '@capacitor/app';
import { isNativeApp } from './utils/platform';
import FinalTest from './pages/FinalTest';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import AdminRoute from './pages/AdminRoute';
import InfoForm from './pages/InfoForm';
import PreEfficacyScale from './pages/PreEfficacyScale';
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

// Android geri tuşu: uygulama içinde bir önceki ekrana döner; açılış/giriş
// ekranında ya da geri gidilecek ekran yoksa uygulamayı kapatır.
function AndroidBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathRef = useRef(location.pathname);

  useEffect(() => {
    pathRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    if (!isNativeApp) return undefined;
    const listener = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack || ['/', '/login'].includes(pathRef.current)) CapApp.exitApp();
      else navigate(-1);
    });
    return () => { listener.then((l) => l.remove()); };
  }, [navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <AndroidBackButton />
      <Routes>
        {/* Herkesin erişebileceği genel sayfalar */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingFlow /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminRoute><AdminPanel /></AdminRoute></ProtectedRoute>} />

        {/* Giriş yapılması gereken korumalı sayfalar */}
        <Route path="/info-form" element={<ProtectedRoute><InfoForm /></ProtectedRoute>} />
        <Route path="/pre-efficacy-scale" element={<ProtectedRoute><PreEfficacyScale /></ProtectedRoute>} />
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

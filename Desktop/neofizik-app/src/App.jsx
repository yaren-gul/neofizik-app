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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/info-form" element={<InfoForm />} />
        <Route path="/pre-test" element={<PreTest />} />
        <Route path="/results" element={<Results />} />
        <Route path="/atlas-map" element={<AtlasMap />} />
        <Route path="/vital-module" element={<VitalModule />} />
        <Route path="/examination-module" element={<ExaminationModule />} />
        <Route path="/reflexes-module" element={<ReflexesModule />} />
        <Route path="/scales-module" element={<ScalesModule />} />
        <Route path="/certificate" element={<Certificate />} />
      </Routes>
    </Router>
  );
}

export default App;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styles } from '../styles'; // veya kendi stillerin

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const navigate = useNavigate();

  const stepsData = [
    {
      title: "NeoFizik’e Hoş Geldiniz",
      description: "Fizik öğrenme deneyiminizi tamamen değiştirecek yeni nesil interaktif platforma adım attınız."
    },
    {
      title: "Modüller ve Modeller",
      description: "Atlas haritası, vital modüller ve muazzam muayene adımlarıyla teoriyi pratikle buluşturun."
    },
    {
      title: "Ölçme ve Değerlendirme",
      description: "Seviyenize uygun ölçekler ve testlerle gelişiminizi anlık olarak takip edin, eksiklerinizi kapatın."
    },
    {
      title: "Gizlilik ve Onay",
      description: "Tüm verileriniz güvenle saklanır. Başlamaya hazırsanız kişisel bilgi formumuzla devam edelim."
    }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    } else {
      navigate('/info-form');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.phoneFrame}>
        <div style={styles.content}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', width: '100%' }}>
            <h2 style={{ margin: 0, fontSize: '22px', color: '#2c3e50', fontWeight: 'bold' }}>NeoFizik</h2>
            <span style={{ fontSize: '14px', backgroundColor: '#eef2f3', padding: '6px 12px', borderRadius: '20px', color: '#666', fontWeight: '600' }}>
              {currentStep} / {totalSteps}
            </span>
          </div>

          <div style={{ marginBottom: '40px', minHeight: '120px', width: '100%' }}>
            <h2 style={{ fontSize: '22px', color: '#2c3e50', marginBottom: '15px' }}>{stepsData[currentStep - 1].title}</h2>
            <p style={{ fontSize: '15px', color: '#555', lineHeight: '1.6', margin: 0 }}>{stepsData[currentStep - 1].description}</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', width: '100%' }}>
            {currentStep > 1 && (
              <button onClick={handlePrev} style={styles.secondaryButton}>
                Geri
              </button>
            )}
            <button onClick={handleNext} style={styles.primaryButton}>
              {currentStep === totalSteps ? "Bilgi Formuna Başla" : "Devam Et"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
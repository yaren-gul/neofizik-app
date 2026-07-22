import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      paddingBottom: '5px',
      marginBottom: '10px',
      boxSizing: 'border-box'
    }}>
      <button 
        onClick={handleLogout}
        title="Çıkış Yap"
        style={{
          background: 'none',
          border: 'none',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '5px',
          borderRadius: '50%',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        🚪
      </button>
    </div>
  );
}

export default Header;
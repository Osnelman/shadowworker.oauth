import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ to, children = '← Retour', className = 'btn btn-secondary' }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  // Add default styling for page-header if not already present
  // This ensures consistency with other page headers
  const finalClassName = className.includes('page-header-back-button') ? className : `${className} page-header-back-button`;

  return (
    <button className={finalClassName} onClick={handleClick}>
      {children}
    </button>
  );
}
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

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
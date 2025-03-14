import React from 'react';
import StyledButton from '@/app/components/StyledButton';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Bienvenue sur la page d'accueil</h1>
      <StyledButton />
    </div>
  );
};

export default HomePage;

import React from 'react';
import LoginForm from './components/LoginForm';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Bienvenue sur la page d'accueil</h1>
      <LoginForm />
    </div>
  );
};

export default HomePage;

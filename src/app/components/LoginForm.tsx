"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { login } from '../utils/airtable';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login: loginUser, user, loading } = useAuth(); // Utilisation du contexte
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && user) {
      router.push("/pages/admin");
    }
  }, [user, loading, router]);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Call the login function
    const user = await login(email, password);
    if (user.length > 0) {
      loginUser(user[0]); // Stocke l'utilisateur
    } else {
      alert("Identifiants incorrects");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;

"use client"
import React, { useState } from 'react';
import { register } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


const MultiStepForm = () => {
  // État pour stocker les données du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    eloBullet: '0',
    eloBlitz: '0',
    eloRapid: '0',
    chesscomUsername: '',
  });
const router = useRouter()
  // État pour suivre l'étape du formulaire
  const [step, setStep] = useState(1);

  // Fonction pour gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fonction pour passer à l'étape suivante
  const handleNextStep = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.password)) {
      alert('Veuillez remplir tous les champs obligatoires avant de continuer.');
      return;
    }
    setStep(step + 1);
  };

  // Fonction pour revenir à l'étape précédente
  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convertir les données en FormData pour la soumission
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key as keyof typeof formData]);
    });

    // Appeler l'action serveur
    try {
      const result = await register(data); // Appeler la fonction de serveur pour enregistrer l'utilisateur
      router.push('/main')
      toast("account created , please login")
    
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white rounded-md shadow-md">
      {step === 1 && (
        <>
          <h2 className="text-xl font-bold mb-4">Étape 1 : Informations de base</h2>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nom
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md text-black"
              required
            />
          </div>
          <button type="button" onClick={handleNextStep} className="px-4 py-2 mt-4 bg-blue-600 hover:bg-blue-700 rounded-md">
            Suivant
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-xl font-bold mb-4">Étape 2 : Objectifs Elo et Pseudo Chess.com</h2>
          <div className="mb-4">
            <label htmlFor="eloBullet" className="block text-sm font-medium mb-1">
              Objectif Elo Bullet
            </label>
            <input
              type="number"
              id="eloBullet"
              name="eloBullet"
              value={formData.eloBullet}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="eloBlitz" className="block text-sm font-medium mb-1">
              Objectif Elo Blitz
            </label>
            <input
              type="number"
              id="eloBlitz"
              name="eloBlitz"
              value={formData.eloBlitz}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="eloRapid" className="block text-sm font-medium mb-1">
              Objectif Elo Rapide
            </label>
            <input
              type="number"
              id="eloRapid"
              name="eloRapid"
              value={formData.eloRapid}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="chesscomUsername" className="block text-sm font-medium mb-1">
              Pseudo Chess.com
            </label>
            <input
              type="text"
              id="chesscomUsername"
              name="chesscomUsername"
              value={formData.chesscomUsername}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md text-black"
            />
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={handlePreviousStep} className="px-4 py-2 mt-4 bg-gray-600 hover:bg-gray-700 rounded-md">
              Précédent
            </button>
            <button type="submit" className="px-4 py-2 mt-4 bg-green-600 hover:bg-green-700 rounded-md">
              Soumettre
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default MultiStepForm;

"use client";

import { Projet } from "@/app/types/Projet";
import { getAirtableProjets } from "../../utils/airtable";
import CreateProjetForm from "@/app/components/CreateProjectForm";
import { useEffect, useState } from "react";
import { insertAirtableProjet } from "../../utils/airtable"; // Assurez-vous d'importer cette fonction si vous l'avez définie

export default function Projets() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [showForm, setShowForm] = useState(false); // État pour afficher/masquer le formulaire

  // Fonction pour récupérer les projets
  useEffect(() => {
    const fetchProjets = async () => {
      const data = await getAirtableProjets();
      console.log("projets", data);
      setProjets(data as Projet[]);
    };
    fetchProjets();
  }, []);

  // Fonction pour gérer la création d'un projet
  const handleCreateProjet = async (projet: Projet) => {
    const response = await insertAirtableProjet(projet);
    if (response.id) {
      console.log("Projet créé avec l'ID:", response.id);
      setProjets((prevProjets) => [...prevProjets, projet]); // Ajouter le projet à l'état
      setShowForm(false); // Masquer le formulaire après la soumission
    } else {
      console.log("Erreur lors de la création du projet");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Projets</h1>
      
      {/* Bouton pour afficher/masquer le formulaire */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md"
      >
        {showForm ? "Annuler" : "Créer un nouveau projet"}
      </button>

      {/* Formulaire de création de projet */}
      {showForm && <CreateProjetForm onCreateProjet={handleCreateProjet} />}

      {/* Affichage des projets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projets.map((projet) => (
          <div key={projet.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{projet.fields.name}</h2>
            <p className="text-gray-700">Description: {projet.fields.description}</p>
            <p className="text-gray-700">Technologies: {projet.fields.technologies.join(", ")}</p>
            <p className="text-gray-700">Lien: <a href={projet.fields.link} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">Voir le projet</a></p>
            <p className="text-gray-700">Promotion: {projet.fields.promotion}</p>
            <p className="text-gray-700">Étudiants: {projet.fields.students}</p>
            <p className="text-gray-700">Catégories: {projet.fields.category.join(", ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

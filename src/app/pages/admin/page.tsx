"use client";

import { Projet } from "@/app/types/Projet";
import { getAirtableProjets } from "../../utils/airtable";
import CreateProjetForm from "@/app/components/CreateProjectForm";
import Dashboard from "@/app/components/Dashboard";
import { useEffect, useState } from "react";
import { insertAirtableProjet } from "../../utils/airtable";

export default function Projets() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalProjets: 0,
    totalLikes: 0,
    visibleProjets: 0,
    hiddenProjets: 0,
    categories: {},
  });
  const [showForm, setShowForm] = useState(false); 
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);

  // Fonction pour récupérer les projets
  useEffect(() => {
    const fetchProjets = async () => {
      const data = await getAirtableProjets();
      console.log("projets", data);
      setProjets(data as Projet[]);
      const stats = calculateDashboardStats(data);
      console.log("projets", stats);
      setDashboardStats(stats);

      // Extraire les catégories uniques à partir des projets
      const allCategories = data
        .flatMap((projet) => projet.fields.category)
        .filter((value, index, self) => self.indexOf(value) === index); // Catégories uniques
      setCategories(allCategories);
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

  const calculateDashboardStats = (projets: Projet[]) => {
    const totalProjets = projets.length;

    // Projets visibles et cachés
    const visibleProjets = projets.filter(projet => projet.fields.visible).length;
    const hiddenProjets = totalProjets - visibleProjets;

    // Nombre total de likes (en comptant le tableau "liked_by")
    const totalLikes = projets.reduce((acc, projet) => acc + (projet.fields.liked_by?.length || 0), 0);

    // Répartition des projets par catégorie
    const categories = projets.reduce((acc, projet) => {
      projet.fields.category.forEach((cat) => {
        acc[cat] = (acc[cat] || 0) + 1;
      });
      return acc;
    }, {});

    return {
      totalProjets,
      totalLikes,
      visibleProjets,
      hiddenProjets,
      categories,
    };
  };

  // Fonction de filtrage des projets en fonction du nom et de la catégorie
  const filteredProjets = projets.filter((projet) => {
    const matchName = projet.fields.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !selectedCategory || projet.fields.category.includes(selectedCategory);
    return matchName && matchCategory;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Interface Administrateur</h1>
      <div className="flex items-center mb-4 gap-4 w-full">
        {/* Champ de recherche */}
        <input
          type="text"
          placeholder="Rechercher un projet par nom"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80 px-4 py-2 border rounded-md"
        />

        {/* Sélecteur de catégories dynamique */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-md"
        >
          <option className="bg" value="">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Bouton pour afficher/masquer le formulaire */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          {showForm ? "Annuler" : "Créer un nouveau projet"}
        </button>
      </div>

      <Dashboard stats={dashboardStats} />

      {showForm && <CreateProjetForm onCreateProjet={handleCreateProjet} />}

      {/* Affichage des projets filtrés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjets.map((projet) => (
          <div key={projet.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{projet.fields.name}</h2>
            <p className="text-gray-700">Description: {projet.fields.description}</p>
            <p className="text-gray-700">Technologies: {projet.fields.technologies.join(", ")}</p>
            <p className="text-gray-700">Lien: <a href={projet.fields.link} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">Voir le projet</a></p>
            <p className="text-gray-700">Promotion: {projet.fields.promotion}</p>
            <p className="text-gray-700">Étudiants: {projet.fields.students}</p>
            <p className="text-gray-700">Catégories: {projet.fields.category.join(", ")}</p>
            <p className="text-gray-700">Nombre de likes: {projet.fields.liked_by?.length || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

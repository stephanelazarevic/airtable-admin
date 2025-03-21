"use client";

import { Projet } from "@/app/types/Projet";
import { getAirtableProjets, updateAirtableProjet, updateVisibilityAirtableProjet } from "../../utils/airtable";
import CreateProjetForm from "@/app/components/CreateProjectForm";
import Dashboard from "@/app/components/Dashboard";
import { useEffect, useState } from "react";
import { insertAirtableProjet } from "../../utils/airtable";
import EditProjetForm from "@/app/components/EditProjetForm";

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
  const [projetEnEdition, setProjetEnEdition] = useState<Projet | null>(null);

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

  // Fonction pour calculer les statistiques du dashboard
  const calculateDashboardStats = (projets: Projet[]) => {
    const totalProjets = projets.length;
    const visibleProjets = projets.filter(projet => projet.fields.visible).length;
    const hiddenProjets = totalProjets - visibleProjets;
    const totalLikes = projets.reduce((acc, projet) => acc + (projet.fields.liked_by?.length || 0), 0);
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

  // Fonction pour changer la visibilité d'un projet
  const toggleVisibility = async (projet: Projet) => {
    const updatedProjet = {
      ...projet,
      fields: {
        ...projet.fields,
        visible: !projet.fields.visible,
      },
    };

    // Mise à jour du projet dans Airtable
    const response = await updateVisibilityAirtableProjet(updatedProjet);
    if (response.success) {
      console.log("Visibilité mise à jour avec succès.");
      setProjets((prevProjets) =>
        prevProjets.map((p) =>
          p.id === projet.id ? updatedProjet : p
        )
      );
    } else {
      console.log("Erreur lors de la mise à jour de la visibilité.");
    }
  };

  const handleUpdateProjet = async (updatedProjet: Projet) => {
    // Mise à jour du projet dans Airtable
    const response = await updateAirtableProjet(updatedProjet);
  
    if (response.success) {
      console.log("Projet mis à jour avec succès.");
  
      // Mettre à jour l'état local
      setProjets((prevProjets) =>
        prevProjets.map((p) =>
          p.id === updatedProjet.id ? updatedProjet : p
        )
      );
    } else {
      console.log("Erreur lors de la mise à jour du projet.");
    }
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
          <option value="">Toutes les catégories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Bouton pour afficher/masquer le formulaire */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-800 text-white rounded-md"
        >
          {showForm ? "Annuler" : "Créer un nouveau projet"}
        </button>
      </div>

      <Dashboard stats={dashboardStats} />

      {showForm && <CreateProjetForm onCreateProjet={handleCreateProjet} />}

      {projetEnEdition && (
        <EditProjetForm
          projet={projetEnEdition}
          onClose={() => setProjetEnEdition(null)}
          onUpdate={(updatedProjet) => {
            setProjets((prevProjets) =>
              prevProjets.map((p) => (p.id === updatedProjet.id ? updatedProjet : p))
            );
          }}
        />
      )}

      {/* Affichage des projets filtrés */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjets.map((projet) => (
          <div key={projet.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{projet.fields.name}</h2>
            <button
                onClick={() => setProjetEnEdition(projet)}
                className="px-4 py-2 mt-2 bg-yellow-600 text-white rounded-md"
              >
                Éditer
            </button>

            <p className="text-gray-700">Description: {projet.fields.description}</p>
            <p className="text-gray-700">Technologies: {projet.fields.technologies.join(", ")}</p>
            <p className="text-gray-700">Lien: <a href={projet.fields.link} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Voir le projet</a></p>
            <p className="text-gray-700">Promotion: {projet.fields.promotion}</p>
            <p className="text-gray-700">Étudiants: {projet.fields.students}</p>
            <p className="text-gray-700">Catégories: {projet.fields.category.join(", ")}</p>
            <p className="text-gray-700">Nombre de likes: {projet.fields.liked_by?.length || 0}</p>
            <button
              onClick={() => toggleVisibility(projet)}
              className={`px-4 py-2 mt-2 rounded-md ${projet.fields.visible ? "bg-gray-800" : "bg-green-800"} text-white`}
            >
              {projet.fields.visible ? "Cacher" : "Montrer"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
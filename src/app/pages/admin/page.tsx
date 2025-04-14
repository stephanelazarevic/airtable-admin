"use client";

import { Projet } from "@/app/types/Projet";
import { getAirtableProjets, updateAirtableProjet } from "../../utils/airtable";
import CreateProjetForm from "@/app/components/CreateProjectForm";
import Dashboard from "@/app/components/Dashboard";
import { useEffect, useState } from "react";
import { insertAirtableProjet } from "../../utils/airtable";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import AdminCommentForm from "@/app/components/AdminCommentForm";
import { useAuth } from "@/app/context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";
import LoadingButton from "@/app/components/LoadingButton";

export default function Projets() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [dashboardStats, setDashboardStats] = useState<{
    totalProjets: number;
    totalLikes: number;
    visibleProjets: number;
    hiddenProjets: number;
    topLikedProjets: Projet[];
    categories: Record<string, number>;
  }>({
    totalProjets: 0,
    totalLikes: 0,
    visibleProjets: 0,
    hiddenProjets: 0,
    topLikedProjets: [],
    categories: {},
  });

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loadingVisibility, setLoadingVisibility] = useState<string | null>(null);


  const { logout } = useAuth();

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

    // Calcul des catégories
    const categories = projets.reduce((acc, projet) => {
      projet.fields.category.forEach((cat) => {
        acc[cat] = (acc[cat] || 0) + 1;
      });
      return acc;
    }, {});

    // Trouver les projets avec le plus de likes
    const maxLikes = Math.max(...projets.map(p => p.fields.liked_by?.length || 0), 0);
    const topLikedProjets = projets.filter(p => (p.fields.liked_by?.length || 0) === maxLikes);

    return {
      totalProjets,
      totalLikes,
      visibleProjets,
      hiddenProjets,
      categories,
      topLikedProjets, // Ajouter les projets les plus likés
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
    const response = await updateAirtableProjet(updatedProjet);
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

  const refreshProjets = async () => {
    const data = await getAirtableProjets();
    setProjets(data);
  };

  // Fonction de filtrage des projets en fonction du nom et de la catégorie
  const filteredProjets = projets.filter((projet) => {
    const matchName = projet.fields.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !selectedCategory || projet.fields.category.includes(selectedCategory);
    return matchName && matchCategory;
  });

  return (
    <ProtectedRoute>
      <div className="w-full mx-auto">
        <div className="bg-zinc-900 p-4 shadow mb-4">
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
              className="px-4 py-2 bg-green-800 hover:bg-green-700 text-white rounded-md"
            >
              {showForm ? "Annuler" : "Créer un nouveau projet"}
            </button>

            {/* Bouton de déconnexion */}
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-md ml-auto"
            >
              Déconnexion
            </button>
          </div>
        </div>
        <div className="container mx-auto mt-4">
          <Dashboard stats={dashboardStats} />

          {showForm && <CreateProjetForm onCreateProjet={handleCreateProjet} />}

          {/* Affichage des projets filtrés */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjets.map((projet) => {
              const comments = (() => {
                try {
                  return projet.fields.admin_comment ? JSON.parse(projet.fields.admin_comment) : [];
                } catch {
                  return [];
                }
              })();

              return (
                <div
                  key={projet.id}
                  className="flex flex-col justify-between rounded-xl border border-gray-300 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800 dark:border-gray-700 p-6 space-y-4"
                >
                  {/* Header avec titre et promotion */}
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">{projet.fields.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-300 italic">{projet.fields.promotion}</p>
                  </div>

                  {/* Informations du projet */}
                  <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <p>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Description:</span> {projet.fields.description}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Technologies:</span> {projet.fields.technologies.join(", ")}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Catégories:</span> {projet.fields.category.join(", ")}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Étudiants:</span> {projet.fields.students}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Likes:</span> {projet.fields.liked_by?.length || 0}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Lien:</span>{' '}
                      <a
                        href={projet.fields.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition duration-200"
                      >
                        Voir le projet
                      </a>
                    </p>
                  </div>

                  {/* Section des commentaires */}
                  <div className="mt-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">Commentaires des admins :</h3>
                    {comments.length > 0 ? (
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        {comments.map((cmt: any, idx: number) => (
                          <li key={idx} className="border-l-4 border-blue-500 pl-3">
                            <strong>{cmt.author}:</strong> {cmt.message}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm dark:text-gray-500">Aucun commentaire.</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <AdminCommentForm projetId={projet.id} onCommentAdded={refreshProjets} />
                  </div>

                  {/* Button Cacher/Montrer */}
                  <div className="mt-auto">
                    <LoadingButton
                      onClick={() => toggleVisibility(projet)}
                      isLoading={loadingVisibility === projet.id}
                      className={`w-full py-3 rounded-lg text-lg font-semibold text-white transition duration-300 ${
                        projet.fields.visible
                          ? 'bg-gray-800 hover:bg-gray-700'
                          : 'bg-green-700 hover:bg-green-600'
                      } flex items-center justify-center gap-2 shadow-md hover:shadow-lg`}
                    >
                      {projet.fields.visible ? (
                        <>
                          <FiEyeOff className="w-5 h-5" />
                          Cacher
                        </>
                      ) : (
                        <>
                          <FiEye className="w-5 h-5" />
                          Montrer
                        </>
                      )}
                    </LoadingButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

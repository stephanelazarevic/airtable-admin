import React from 'react';
import { Projet } from '../types/Projet';

type DashboardStats = {
  totalProjets: number;
  totalLikes: number;
  visibleProjets: number;
  hiddenProjets: number;
  topLikedProjets: Projet[];
  categories: { [key: string]: number };
};

type DashboardProps = {
  stats: DashboardStats;
};

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  return (
    <div className="m-6 p-6 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

      <div className="flex space-x-6">
        <div className="p-4 border rounded shadow">
          <h3 className="text-lg font-semibold">Nombre de projets</h3>
          <p className="text-2xl">{stats.totalProjets}</p>
        </div>

        <div className="p-4 border rounded shadow flex-1">
          <h3 className="text-lg font-semibold">Nombre de likes</h3>
          <p className="text-2xl">{stats.totalLikes}</p>
        </div>

        <div className="p-4 border rounded shadow flex-1">
          <h3 className="text-lg font-semibold">Projets visibles</h3>
          <p className="text-2xl">{stats.visibleProjets} / {stats.totalProjets}</p>
        </div>

        <div className="p-4 border rounded shadow flex-1">
          <h3 className="text-lg font-semibold">Projets cachés</h3>
          <p className="text-2xl">{stats.hiddenProjets}</p>
        </div>

        <div className="p-4 border rounded shadow flex-1">
          <h3 className="text-lg font-semibold">Projets les plus likés</h3>
              {stats.topLikedProjets.length > 0 ? (
            <ul>
              {stats.topLikedProjets.map((projet) => (
                <li key={projet.id} className="text-gray-700">
                  <strong>{projet.fields.name}</strong> - {projet.fields.liked_by?.length || 0} likes
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aucun projet n'a encore de likes.</p>
          )}
        </div>

        <div className="p-4 border rounded shadow flex-1">
          <h3 className="text-lg font-semibold">Répartition par catégorie</h3>
          <ul>
            {Object.entries(stats.categories).map(([category, count]) => (
              <li key={category}>
                {category}: {count}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

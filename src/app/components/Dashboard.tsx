import React from 'react';
import { Projet } from '../types/Projet';
import { FiFolder, FiHeart, FiEye, FiEyeOff, FiStar } from 'react-icons/fi';

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

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}> = ({ icon, title, value }) => (
  <div className="p-5 border rounded-xl shadow flex flex-col items-start bg-custom text-custom">
    <div className="text-sm flex items-center gap-2 mb-2">
      {icon}
      <span>{title}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  const top3 = [...stats.topLikedProjets]
    .sort((a, b) => (b.fields.likes || 0) - (a.fields.likes || 0))
    .slice(0, 3);

  const podiumColors = ['bg-yellow-100 dark:bg-yellow-900', 'bg-gray-200 dark:bg-gray-800', 'bg-orange-200 dark:bg-orange-800'];
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="m-8 p-8 rounded-2xl shadow space-y-8 bg-custom text-custom">
      <h2 className="text-3xl font-bold">Dashboard</h2>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard icon={<FiFolder />} title="Projets" value={stats.totalProjets} />
        <StatCard icon={<FiHeart />} title="Likes" value={stats.totalLikes} />
        <StatCard icon={<FiEye />} title="Visibles" value={`${stats.visibleProjets} / ${stats.totalProjets}`} />
        <StatCard icon={<FiEyeOff />} title="Cachés" value={stats.hiddenProjets} />
      </div>

      {/* Podium des projets */}
      <div>
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <FiStar className="text-yellow-400" /> Top 3 des projets les plus likés
        </h3>

        {top3.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {top3.map((projet, index) => (
              <div
                key={projet.id}
                className={`rounded-xl p-6 border-2 shadow-sm bg-custom text-custom ${podiumColors[index]}`}
              >
                <div className="text-xl font-bold flex items-center gap-2">
                  {medals[index]} {projet.fields.name}
                </div>
                <p className="text-sm mt-2">
                  {projet.fields.likes || 0} like{(projet.fields.likes || 0) > 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">Aucun projet n'a encore de likes.</p>
        )}
      </div>

      {/* Répartition par catégorie */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Répartition par catégorie</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {Object.entries(stats.categories).map(([category, count]) => (
            <li
              key={category}
              className="p-3 rounded-lg shadow border bg-custom text-custom"
            >
              <span className="font-semibold">{category} :</span> {count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { getProjectById } from '@/app//utils/airtable';
import { Project } from '@/app//types';

const ProjectDetail = ({ id }: { id: string }) => {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      const data = await getProjectById(id);
      setProject(data);
    };

    fetchProject();
  }, [id]);

  if (!project) return <div>Chargement...</div>;

  return (
    <div>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <p>Technos : {project.technos}</p>
      <p>Lien : <a href={project.link} target="_blank" rel="noopener noreferrer">Voir le projet</a></p>
      <p>Visuels : {project.visuals}</p>
      <p>Étudiants : {project.students}</p>
      <p>Catégorie : {project.category}</p>
      <p>Likes : {project.likes}</p>
    </div>
  );
};

export default ProjectDetail;

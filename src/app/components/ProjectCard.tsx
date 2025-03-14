import React from 'react';
import Link from 'next/link';
import { Project } from '@/app/types';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="project-card">
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <Link href={`/admin/project/${project.id}`}>Voir Détails</Link>
      <Link href={`/admin/edit/${project.id}`}>Éditer</Link>
    </div>
  );
};

export default ProjectCard;

"use client";

import React, { useEffect, useState } from 'react';
import { Project } from '@/app/types';
import { getProjects } from '../../utils/airtable';
import ProjectCard from '../../components/ProjectCard';

const AdminDashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getProjects();
      setProjects(data);
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Total Projects: {projects.length}</p>
      <div>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

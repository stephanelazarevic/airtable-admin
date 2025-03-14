import React, { useState } from 'react';
import ProjectForm from '@/app/components/ProjectForm';
import { createProject } from '@/app/utils/airtable';
import { ProjectFormData } from '@/app/types';

const CreateProject = () => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    technos: '',
    link: '',
    visuals: '',
    promotion: '',
    students: '',
    category: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createProject(formData);
    alert('Projet créé avec succès');
  };

  return (
    <div>
      <h1>Créer un Nouveau Projet</h1>
      <ProjectForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} />
    </div>
  );
};

export default CreateProject;

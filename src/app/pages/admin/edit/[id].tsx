import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ProjectForm from '@/app/components/ProjectForm';
import { getProjectById, updateProject } from '@/app//utils/airtable';
import { Project, ProjectFormData } from '@/app//types';

const EditProject = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formData, setFormData] = useState<ProjectFormData | null>(null);

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        const project = await getProjectById(id as string);
        setFormData({
          name: project.name,
          description: project.description,
          technos: project.technos,
          link: project.link,
          visuals: project.visuals,
          promotion: project.promotion,
          students: project.students,
          category: project.category
        });
      };

      fetchProject();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData && id) {
      await updateProject(id as string, formData);
      alert('Projet modifié avec succès');
    }
  };

  if (!formData) return <div>Chargement...</div>;

  return (
    <div>
      <h1>Éditer le Projet</h1>
      <ProjectForm formData={formData} setFormData={setFormData} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditProject;

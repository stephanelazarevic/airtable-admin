import React from 'react';
import { ProjectFormData } from '@/app/types';

interface ProjectFormProps {
  formData: ProjectFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  onSubmit: (e: React.FormEvent) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ formData, setFormData, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Nom du projet</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div>
        <label>Technos</label>
        <input
          type="text"
          value={formData.technos}
          onChange={(e) => setFormData({ ...formData, technos: e.target.value })}
        />
      </div>
      <div>
        <label>Lien</label>
        <input
          type="text"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
        />
      </div>
      <div>
        <label>Visuels</label>
        <input
          type="text"
          value={formData.visuals}
          onChange={(e) => setFormData({ ...formData, visuals: e.target.value })}
        />
      </div>
      <div>
        <label>Promotion</label>
        <input
          type="text"
          value={formData.promotion}
          onChange={(e) => setFormData({ ...formData, promotion: e.target.value })}
        />
      </div>
      <div>
        <label>Étudiants</label>
        <input
          type="text"
          value={formData.students}
          onChange={(e) => setFormData({ ...formData, students: e.target.value })}
        />
      </div>
      <div>
        <label>Catégorie</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        />
      </div>
      <button type="submit">Soumettre</button>
    </form>
  );
};

export default ProjectForm;

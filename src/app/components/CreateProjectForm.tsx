import React, { useState } from "react";
import { Projet } from "@/app/types/Projet"; 

interface CreateProjetFormProps {
  onCreateProjet: (projet: Projet) => void; // Fonction qui sera appelée pour créer un projet
}

const CreateProjetForm: React.FC<CreateProjetFormProps> = ({ onCreateProjet }) => {
  const [formData, setFormData] = useState<Projet>({
    id: "", // L'ID peut être vide ici, car il est généré par Airtable
    fields: {
      name: "",
      description: "",
      technologies: [],
      lien: "",
      promotion: "",
      students: "",
      category: [],
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      fields: {
        ...prevData.fields,
        [name]: value,
      },
    }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: "technologies" | "category") => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      fields: {
        ...prevData.fields,
        [field]: value.split(",").map((item) => ({ id: "", name: item.trim() })),
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateProjet(formData); // Appel de la fonction passée en props pour envoyer les données du projet
    setFormData({
      id: "",
      fields: {
        name: "",
        description: "",
        technologies: [],
        lien: "",
        promotion: "",
        students: "",
        category: [],
      },
    }); // Réinitialise le formulaire après soumission
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nom du projet
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.fields.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description du projet
        </label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.fields.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="technologies" className="block text-sm font-medium text-gray-700">
          Technologies (séparées par des virgules)
        </label>
        <input
          type="text"
          id="technologies"
          name="technologies"
          value={formData.fields.technologies.map((t) => t.name).join(", ")}
          onChange={(e) => handleArrayChange(e, "technologies")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Catégories (séparées par des virgules)
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.fields.category.map((c) => c.name).join(", ")}
          onChange={(e) => handleArrayChange(e, "category")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="lien" className="block text-sm font-medium text-gray-700">
          Lien
        </label>
        <input
          type="url"
          id="lien"
          name="lien"
          value={formData.fields.lien}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="promotion" className="block text-sm font-medium text-gray-700">
          Promotion
        </label>
        <input
          type="text"
          id="promotion"
          name="promotion"
          value={formData.fields.promotion}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="students" className="block text-sm font-medium text-gray-700">
          Étudiants (séparés par des virgules)
        </label>
        <input
          type="text"
          id="students"
          name="students"
          value={formData.fields.students}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
        Créer
      </button>
    </form>
  );
};

export default CreateProjetForm;

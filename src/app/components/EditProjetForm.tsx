import { useState } from "react";
import { Projet } from "@/app/types/Projet";
import { updateAirtableProjet } from "@/app/utils/airtable";

type EditProjetFormProps = {
  projet: Projet;
  onClose: () => void;
  onUpdate: (updatedProjet: Projet) => void;
};

export default function EditProjetForm({ projet, onClose, onUpdate }: EditProjetFormProps) {
  const [formData, setFormData] = useState(projet.fields);

  // Gestion des modifications de champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Envoi des modifications
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedProjet = { ...projet, fields: formData };
    const response = await updateAirtableProjet(updatedProjet);

    if (response.success) {
      console.log("Projet mis à jour avec succès.");
      onUpdate(updatedProjet);
      onClose();
    } else {
      console.log("Erreur lors de la mise à jour du projet.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Modifier le Projet</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="Nom du projet"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="Description"
          />
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="Lien du projet"
          />
          <input
            type="text"
            name="promotion"
            value={formData.promotion}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="Promotion"
          />
          <input
            type="text"
            name="students"
            value={formData.students}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="Étudiants"
          />
          <textarea
            name="admin_comments"
            value={formData.admin_comments || ""}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="Commentaires Admin"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { useState } from "react";
import { addAdminComment } from "@/app/utils/airtable";

type Props = {
  projetId: string;
  onCommentAdded: () => void; // Rafraîchir après ajout
};

export default function AdminCommentForm({ projetId, onCommentAdded }: Props) {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const response = await addAdminComment(projetId, "Admin", comment);
    if (response.success) {
      setComment("");
      onCommentAdded(); // Mettre à jour les projets
    } else {
      console.error("Erreur :", response.error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Ajouter un commentaire"
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
        Ajouter
      </button>
    </form>
  );
}

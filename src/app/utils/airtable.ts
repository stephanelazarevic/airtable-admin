"use server";
 
import Airtable from "airtable";
import { Projet } from "@/app/types/Projet";
 
const base = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base("appKEVqk50j9qEHIT");

export async function getAirtableProjets() {
  // Récupérer toutes les données de la table `Tâche`
  const projets = base.table("tbl2FbQ9V2cOfvjkt").select().all();
 
  // Retourner les données sous forme de tableau
  return (await projets).map((projet : any) => ({
    id: projet.id,
    fields: projet.fields,
  }));
}

export async function insertAirtableProjet(projet: Projet) {
  const createProjet = await base.table("tbl2FbQ9V2cOfvjkt").create({
    name: projet.fields.name,         
    description: projet.fields.description, 
    technologies: projet.fields.technologies.map((t) => t.name), // Si c'est une sélection multiple, envoyer les noms
    link: projet.fields.link,
    promotion: projet.fields.promotion,
    students: projet.fields.students,
    category: projet.fields.category.map((c) => c.name),
  });
 
  if (!createProjet.id) {
    console.log(createProjet);
    return {};
  } else {
    return { id: createProjet.id };
  }
}

export async function updateAirtableProjet(projet: Projet) {
  try {
    const updatedProjet = await base
      .table("tbl2FbQ9V2cOfvjkt")
      .update(projet.id, {
        visible: projet.fields.visible,
      });

    // Ne retourner que les données nécessaires (sans méthodes ni objets complexes)
    const updatedProjetFields = {
      id: updatedProjet.id,
      fields: updatedProjet.fields,
    };

    return { success: true, projet: updatedProjetFields };
  } catch (error) {
    console.error("Erreur lors de la mise à jour du projet:", error);
    return { success: false, error: error };
  }
}

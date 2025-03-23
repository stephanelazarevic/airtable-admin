"use server";
 
import Airtable from "airtable";
import { Projet } from "@/app/types/Projet";
import * as crypto from 'crypto';

const base = new Airtable({
  apiKey: process.env.AIRTABLE_KEY,
}).base("appKEVqk50j9qEHIT");

export async function login(email: string, password: string) {
  let hashedpassword = crypto.createHash('md5').update(password).digest("hex");
  const user = base.table("tblrBXF7mBcl2bxzX").select({
    filterByFormula: `AND(email = '${email}', password = '${hashedpassword}')`
  }).all();
  return (await user).map((user : any) => ({
    id: user.id,
    fields: user.fields,
  }));
}

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

export async function addAdminComment(projetId: string, author: string, message: string) {
  try {
    // Récupérer le projet actuel
    const projet = await base.table("tbl2FbQ9V2cOfvjkt").find(projetId);

    // Convertir les commentaires existants en tableau
    let currentComments = [];
    if (projet.fields.admin_comment) {
      try {
        currentComments = JSON.parse(projet.fields.admin_comment);
      } catch (error) {
        console.error("Erreur de parsing JSON:", error);
      }
    }

    // Ajouter le nouveau commentaire
    const updatedComments = [...currentComments, { author, message }];

    // Mettre à jour Airtable avec la nouvelle liste de commentaires sous forme de string JSON
    const updatedProjet = await base.table("tbl2FbQ9V2cOfvjkt").update(projetId, {
      admin_comment: JSON.stringify(updatedComments),
    });

    return {
      success: true,
      projet: {
        id: updatedProjet.id,
        fields: updatedProjet.fields,
      },
    };
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire:", error);
    return {
      success: false,
      error: { message: (error as any).message || "Erreur inconnue" },
    };
  }
}

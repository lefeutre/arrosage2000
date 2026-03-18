import { neon } from '@netlify/neon';

export const handler = async (event) => {
  // On s'assure que c'est bien une requête pour envoyer des données (POST)
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Méthode non autorisée' };
  }

  try {
    // On lit ce que le site web nous a envoyé
    const data = JSON.parse(event.body);
    const nouvelEtatPompe = data.pompe_etat; // true ou false

    const sql = neon();
    
    // On met à jour la base de données Neon
    await sql`UPDATE systeme_arrosage SET pompe_etat = ${nouvelEtatPompe} WHERE id = 1`;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "État de la pompe mis à jour avec succès" })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
import { neon } from '@netlify/neon';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Méthode non autorisée' };
  }

  try {
    const data = JSON.parse(event.body);
    const nouvelEtatPompe = data.pompe_etat; 
    const nouvelEtatResetAP = data.reset_ap !== undefined ? data.reset_ap : false;
    
    // LA CORRECTION EST LÀ : On récupère la durée envoyée par l'Arduino
    const nouvelleDuree = data.duree !== undefined ? data.duree : 0;

    const sql = neon();
    
    // ET LÀ : On l'efface pour de vrai dans la base de données !
    await sql`UPDATE systeme_arrosage SET pompe_etat = ${nouvelEtatPompe}, reset_ap = ${nouvelEtatResetAP}, duree = ${nouvelleDuree} WHERE id = 1`;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "État mis à jour avec succès" })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

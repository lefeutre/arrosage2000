import { neon } from '@netlify/neon';

export const handler = async (event) => {
  // On s'assure que c'est bien une requête pour envoyer des données (POST)
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Méthode non autorisée' };
  }

  try {
    // On lit ce que le site web nous a envoyé (pompe, durée et ordre de reset)
    const data = JSON.parse(event.body);
    const nouvelEtatPompe = data.pompe_etat; 
    const nouvelleDuree = data.duree !== undefined ? data.duree : 0;
    const nouvelEtatResetAP = data.reset_ap !== undefined ? data.reset_ap : false;

    const sql = neon();
    
    // On met à jour ta ligne id = 1 avec toutes les variables nécessaires
    await sql`UPDATE systeme_arrosage SET pompe_etat = ${nouvelEtatPompe}, duree = ${nouvelleDuree}, reset_ap = ${nouvelEtatResetAP} WHERE id = 1`;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "État de la pompe, durée et reset_ap mis à jour avec succès" })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

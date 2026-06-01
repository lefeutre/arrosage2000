import { neon } from '@netlify/neon';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Méthode non autorisée' };
  }

  try {
    const data = JSON.parse(event.body);
    const nouvelEtatPompe = data.pompe_etat; 
    const nouvelEtatResetAP = data.reset_ap !== undefined ? data.reset_ap : false;
    const nouvelleDuree = data.duree !== undefined ? data.duree : 0;

    const sql = neon();
    
    // CORRECTION VISÉE : On cible dynamiquement la dernière ligne de la table
    // au lieu de chercher un ID informatique précis qui a pu changer.
    await sql`
      UPDATE systeme_arrosage 
      SET pompe_etat = ${nouvelEtatPompe}, 
          reset_ap = ${nouvelEtatResetAP}, 
          duree = ${nouvelleDuree} 
      WHERE id = (SELECT id FROM systeme_arrosage ORDER BY id DESC LIMIT 1)
    `;
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "État mis à jour avec succès" })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

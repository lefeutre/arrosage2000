import { neon } from '@netlify/neon';

export const handler = async (event) => {
  try {
    const sql = neon();
    
    // On ajoute 'duree' et 'reset_ap' à ton ancienne requête SQL
    const result = await sql`SELECT pompe_etat, volume_eau, planning, duree, reset_ap FROM systeme_arrosage ORDER BY id DESC LIMIT 1`;
    
    // Sécurité : si la table est vide, on renvoie du vide avec nos nouvelles variables
    if (result.length === 0) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pompe_etat: false, volume_eau: 0, planning: [], duree: 0, reset_ap: false })
      };
    }

    const data = result[0];
    if (!data.planning) data.planning = [];
    
    // Sécurité au cas où la ligne en BDD n'a pas encore de valeurs pour ces colonnes
    if (data.duree === undefined) data.duree = 0;
    if (data.reset_ap === undefined) data.reset_ap = false;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

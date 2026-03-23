import { neon } from '@netlify/neon';

export const handler = async (event) => {
  try {
    const sql = neon();
    
    // On prend la dernière ligne du tableau (ORDER BY id DESC LIMIT 1)
    const result = await sql`SELECT pompe_etat, volume_eau, planning FROM systeme_arrosage ORDER BY id DESC LIMIT 1`;
    
    // Sécurité : si la table est vide, on renvoie du vide au lieu de planter
    if (result.length === 0) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pompe_etat: false, volume_eau: 0, planning: [] })
      };
    }

    const data = result[0];
    if (!data.planning) data.planning = [];

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

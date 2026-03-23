import { neon } from '@netlify/neon';

export const handler = async (event) => {
  try {
    const sql = neon();
    
    // Ajout de la colonne 'planning' dans la requête
    const result = await sql`SELECT pompe_etat, volume_eau, planning FROM systeme_arrosage WHERE id = 1`;
    
    const data = result[0];
    
    // Sécurité : si le planning est totalement vide dans Neon, on renvoie un tableau vide []
    if (!data.planning) {
      data.planning = [];
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

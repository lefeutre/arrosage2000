import { neon } from '@netlify/neon';

export const handler = async (event) => {
  try {
    // Connexion automatique et sécurisée à Neon
    const sql = neon();
    
    // On va chercher la ligne numéro 1 de notre tableau
    const result = await sql`SELECT pompe_etat, volume_eau FROM systeme_arrosage WHERE id = 1`;
    
    // On renvoie le résultat au format JSON
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result[0])
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
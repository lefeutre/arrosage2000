import { neon } from '@netlify/neon';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const data = JSON.parse(event.body);
    const volume = data.volume_eau;

    const sql = neon();
    
    // Met à jour le volume d'eau dans la base de données
    await sql`
      UPDATE systeme_arrosage 
      SET volume_eau = ${volume}, 
          derniere_mise_a_jour = CURRENT_TIMESTAMP
    `;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Volume mis à jour avec succès" })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
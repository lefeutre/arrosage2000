import { neon } from '@netlify/neon';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const data = JSON.parse(event.body);
    const nouveauPlanning = data.planning;

    const sql = neon();
    
    // On met à jour la base de données globalement
    await sql`
      UPDATE systeme_arrosage 
      SET planning = ${JSON.stringify(nouveauPlanning)}::jsonb, 
          derniere_mise_a_jour = CURRENT_TIMESTAMP
    `;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Planning sauvegardé avec succès" })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

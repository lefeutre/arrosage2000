import { neon } from '@netlify/neon';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const data = JSON.parse(event.body);
    const pompe_etat = data.pompe_etat;
    
    // On récupère la durée pour pouvoir la remettre à 0 (évite le bug du rallumage)
    const duree = data.duree !== undefined ? data.duree : 0;

    const sql = neon();
    
    // On utilise TA requête SQL qui marche partout
    await sql`
      UPDATE systeme_arrosage 
      SET pompe_etat = ${pompe_etat}, 
          duree = ${duree},
          derniere_mise_a_jour = CURRENT_TIMESTAMP
    `;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Pompe et chrono mis à jour" })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

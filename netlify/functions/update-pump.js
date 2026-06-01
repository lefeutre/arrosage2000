import { neon } from '@netlify/neon';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  try {
    const data = JSON.parse(event.body);
    const pompe_etat = data.pompe_etat;

    const sql = neon();
    
    await sql`
      UPDATE systeme_arrosage 
      SET pompe_etat = ${pompe_etat}, 
          derniere_mise_a_jour = CURRENT_TIMESTAMP
    `;

    // L'ASTUCE EST LÀ : On écrit littéralement "200 OK" dans le texte
    // pour que l'Arduino le trouve, valide son envoi et arrête de spammer !
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "200 OK Pompe mise à jour" })
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};

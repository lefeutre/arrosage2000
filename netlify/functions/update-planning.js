import { neon } from '@netlify/neon';

export const handler = async (event) => {
  // On s'assure que c'est bien une demande d'enregistrement (POST)
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const nouveauPlanning = data.planning; // On récupère le tableau envoyé par le site

    const sql = neon();
    
    // On met à jour la case 'planning' dans Neon pour notre ligne (id = 1)
    // Le ::jsonb à la fin assure que Neon comprend bien que c'est du JSON
    await sql`
      UPDATE systeme_arrosage 
      SET planning = ${JSON.stringify(nouveauPlanning)}::jsonb, 
          derniere_mise_a_jour = CURRENT_TIMESTAMP 
      WHERE id = 1
    `;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Planning sauvegardé avec succès" })
    };
  } catch (error) {
    console.error("Erreur de sauvegarde:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Erreur lors de la sauvegarde du planning" }) 
    };
  }
};
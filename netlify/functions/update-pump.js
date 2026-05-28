// Si tu as des lignes d'importation pour ta base de données en haut, GARDE-LES ici !
// Exemple : const { createClient } = require('@supabase/supabase-js');

// Stockage temporaire globale (utilisé si tu n'as pas de base de données)
if (!global.systemState) {
    global.systemState = { pompe_etat: false, volume_eau: 5.0, duree: 0, reset_ap: false, planning: [] };
}

exports.handler = async (event, context) => {
    // Gestion du protocole CORS pour éviter les blocages de sécurité navigateurs
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            }
        };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Méthode non autorisée" };
    }

    try {
        const data = JSON.parse(event.body);
        
        // 1. Extraction propre de toutes les variables transmises
        const nouvelEtatPompe = data.pompe_etat;
        const nouvelleDuree = data.duree !== undefined ? data.duree : 0;
        const nouvelEtatResetAP = data.reset_ap !== undefined ? data.reset_ap : false;

        // 2. Mise à jour du stockage local temporaire
        global.systemState.pompe_etat = nouvelEtatPompe;
        global.systemState.duree = nouvelleDuree;
        global.systemState.reset_ap = nouvelEtatResetAP;

        // =========================================================================
        // 💡 SI TU UTILISES UNE BASE DE DONNÉES : Insère ta ligne de sauvegarde ici !
        // Tu dois juste ajouter "reset_ap: nouvelEtatResetAP" dans ton objet de mise à jour.
        // Exemple : await supabase.from('arrosage').update({ pompe_etat: nouvelEtatPompe, duree: nouvelleDuree, reset_ap: nouvelEtatResetAP }).eq('id', 1);
        // =========================================================================

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ 
                status: "success", 
                message: "Paramètres de la pompe synchronisés avec succès",
                state: global.systemState 
            })
        };
    } catch (error) {
        return { 
            statusCode: 500, 
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ status: "error", message: error.message }) 
        };
    }
};

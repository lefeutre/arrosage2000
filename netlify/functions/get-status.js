// Si tu as des lignes d'importation pour ta base de données en haut, GARDE-LES ici !

if (!global.systemState) {
    global.systemState = { pompe_etat: false, volume_eau: 5.0, duree: 0, reset_ap: false, planning: [] };
}

exports.handler = async (event, context) => {
    try {
        // =========================================================================
        // 💡 SI TU UTILISES UNE BASE DE DONNÉES : Récupère tes données ici !
        // Exemple : const { data } = await supabase.from('arrosage').select('*').single();
        // Si tu fais ça, remplace "global.systemState.xxx" en bas par "data.xxx"
        // =========================================================================

        // Renvoi de la réponse complète et structurée à l'Arduino et à l'application web
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                pompe_etat: global.systemState.pompe_etat,
                volume_eau: global.systemState.volume_eau,
                duree: global.systemState.duree,
                reset_ap: global.systemState.reset_ap || false, // Sécurité anti-crash : renvoie false par défaut si le champ n'existe pas encore
                planning: global.systemState.planning || []
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

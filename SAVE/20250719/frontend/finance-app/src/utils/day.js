/**
 * Fonction qui permet de formater la date au format YYYY-MM-JJ
 * @returns {String} Retourne une chaine de caractère au fomat 'YYYY-MM-JJ'
 */
export function getDay () {
    const now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth()+1;
    let day = now.getDate();
    return `${year}-${month}-${day}`
}

/**
 * Fonction qui retourne la date de la veille au format YYYY-MM-JJ
 * @returns {String} Chaine de caractères au format 'YYYY-MM-JJ'
 */
export function getYesterday() {
    let now = new Date();
    // On soustrait 1 jour (en millisecondes)
    now.setDate(now.getDate() - 1);

    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Mois commence à 0
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
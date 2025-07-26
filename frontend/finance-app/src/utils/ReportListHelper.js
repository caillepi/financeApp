import { computeScore } from "./score";

export function sortDataReport (data, sortConfig) {
    let sortable = [...data];
    if (sortConfig.key) {
        sortable.sort((a, b) => {
            let valA = a[sortConfig.key];
            let valB = b[sortConfig.key];

            // Gestion des "Note Globale" calculée
            if (sortConfig.key === 'score') {
                valA = computeScore(a.sma, a.macd, a.bollinger, a.rsi);
                valB = computeScore(b.sma, b.macd, b.bollinger, b.rsi);
            }

            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();

            if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }
    return sortable;
}

export function filterDataReport (data, filters) {
    return data.filter((item) => {
        // nom de l'entreprise
        const matchesName = item.name.toLowerCase().includes(filters.name.toLowerCase());
        // code de l'entreprise
        const matchesCode = item.code.toLowerCase().includes(filters.code.toLowerCase());
        // cours de la bourse
        const matchesCoursMin = filters.coursMin ? item.current >= parseFloat(filters.coursMin) : true;
        const matchesCoursMax = filters.coursMax ? item.current <= parseFloat(filters.coursMax) : true;
        // score
        let score = computeScore(item.sma, item.macd, item.bollinger, item.rsi);
        const matchesNoteMin = filters.noteMin ? score >= parseFloat(filters.noteMin) : true;
        const matchesNoteMax = filters.noteMax ? score <= parseFloat(filters.noteMax) : true;
        // isActive
        const matchesIsActive = item.isActive == filters.isActive ? true : false;
        return matchesName && matchesCode && matchesCoursMin && matchesCoursMax && matchesNoteMin && matchesNoteMax && matchesIsActive;
    });
}

export function reloadDataReport (setReportData, setOffset, setReloadProp) {
    // effacer les valeurs du tableau
    setReportData([]);
    // remettre l'offset à 0
    setOffset(0);
    // changement de valeur pour exécuter le useEffect et recharger les données
    setReloadProp(prev => prev === 0 ? 1 : 0);
}
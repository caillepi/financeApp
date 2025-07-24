import React from "react";
import './ProgressBar.css';

function ProgressBar ({kpi}) {

    function roundKpi(kpi) {
        return parseFloat(kpi).toFixed(1);
    }

    if (kpi == 'N/A' || kpi < 0 || kpi > 100) {
        return <>
             <div id="progressbar">
                -
             </div>
        </>
    }

    return <>
        <div id="progressbar">
            <div style={{ marginTop: '20px', position: 'relative', width: '100%', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '10px' }}>
                {/* La barre verticale qui se déplace */}
                <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: `${kpi}%`,                                    // La position de la barre verticale, calculée par rapport au pourcentage
                    width: '5px',                                       // Largeur fixe de la barre verticale
                    height: '100%',                                     // Hauteur de la barre de progression
                    backgroundColor: kpi > 50 ? '#4caf50' : '#f44336',  // La couleur change en fonction du pourcentage
                    borderRadius: '5px',                                // courbure des coins de la bordure 
                    transition: 'left 0.5s ease'                        // Transition pour un déplacement fluide
                }}
                />
            </div>

            {/* Affichage du pourcentage */}
            <div style={{ textAlign: 'center', marginTop: '5px', color: kpi > 50 ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                {roundKpi(kpi)}%
            </div>
        </div>
    </>
}

export default ProgressBar;
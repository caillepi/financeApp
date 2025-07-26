import './ReportListActions.css';

function ReportListActions ({handleReloadData, handleExportPDF, handleSendEmail}) {

    return <>
        <div id="reportlist-actions">
            <button 
                onClick = {handleReloadData}
                className="reportlist-actions-reload"
                >
                Recharger les données
            </button>
            <button 
                onClick={handleExportPDF}
                className="reportlist-actions-export"
                >
                Exporter en PDF
            </button>
            <button 
                onClick={() => handleSendEmail(emailContent.current.innerHTML)}
                className="reportlist-actions-email"
                >
                Envoyer un email
            </button>
        </div>
    </>
}

export default ReportListActions;
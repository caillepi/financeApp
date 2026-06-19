import { Button, Grid } from '@mui/material';
import './ReportListActions.css';

function ReportListActions ({handleReloadData, handleExportPDF, handleSendEmail}) {

    return <>
        <Grid>
            <h2>Actions</h2>
            <Grid>
                <Button 
                    onClick = {handleReloadData}
                    color='primary.main'
                    >
                    Recharger les données
                </Button>
            </Grid>
            <Grid>
                <Button 
                    onClick={handleExportPDF}
                    color='primary.main'
                    >
                    Exporter en PDF
                </Button>
            </Grid>
            <Grid>
                <Button 
                    onClick={() => handleSendEmail(emailContent.current.innerHTML)}
                    color='primary.main'
                    >
                    Envoyer un email
                </Button>
            </Grid>
        </Grid>
    </>
}

export default ReportListActions;
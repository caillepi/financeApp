import React, { useRef, useState } from "react";
import { useTickersList } from "../hook/useTickerList";
import './ReportList.css';
import ReportListFilter from "./ReportListFilter";
import { handleExportPDF } from "../utils/pdfExport";
import { handleSendEmail } from "../utils/sendEmail";
import ReportListActions from "./ReportListActions";
import ReportListTable from "./ReportListTable";
import { filterDataReport, sortDataReport } from "../utils/ReportListHelper";
import { useReportData } from "../hook/useReportData";

function ReportList() {
    const { tickersList } = useTickersList();
    const [reloadProp, setReloadProp] = useState(0);
    const [limit, setLimit] = useState(1);          // nombre d'éléments à charger par batch de chargement
    const { reportData, setReportData, offset, setOffset } = useReportData(tickersList, reloadProp, limit);

    const [sortConfig, setSortConfig] = useState({key: null, direction: 'asc'});
    const [filters, setFilters] = useState({name: '', code: '', coursMin: '', coursMax: '', noteMin: '', noteMax: '', isActive: ''});

    const emailContent = useRef();

    const sortedData = React.useMemo(() => sortDataReport(reportData, sortConfig), [reportData, sortConfig]);
    const filteredData = React.useMemo(() => filterDataReport(sortedData, filters), [sortedData, filters]);

    return <>
        <div id="reportlist" ref={emailContent}>
            {/* Mise en place des boutons d'actions */}
            <ReportListActions
                handleReloadData={() => handleReloadData(setReportData, setOffset, setReloadProp)}
                handleExportPDF={handleExportPDF}
                handleSendEmail={handleSendEmail}
                />

            {/* Mise en place des filtres */}
            <ReportListFilter 
                onFilterChange = {setFilters}
                />

            {/* Mise en place des tableaux */}
            <ReportListTable
                data = { filteredData }
                setData = { setReportData }
                setSortConfig = { setSortConfig }
                />
        </div>
    </>
}

export default ReportList;
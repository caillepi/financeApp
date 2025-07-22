import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function handleExportPDF() {
    const input = document.getElementById("reportlist-table");
    if (!input) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${year}${month}${day}_${hour}h${minute}m${second}s_rapport_kpi.pdf`);
}
"use client";
import { Download } from "lucide-react";
import { useState } from "react";

export default function AdminExport({ data, filename }) {
  const [open, setOpen] = useState(false);

  if (!data || data.length === 0) return null;

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename + ".json";
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const downloadCSV = () => {
    if (!data.length) return;
    const header = Object.keys(data[0]).join(",");
    const rows = data.map(obj => Object.values(obj).map(val => {
      let v = val === null || val === undefined ? "" : String(val);
      v = v.replace(/"/g, '""');
      return '"' + v + '"';
    }).join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename + ".csv";
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const downloadExcel = () => {
    let tableStr = '<html><head><meta charset="utf-8"></head><body><table><tr>';
    Object.keys(data[0]).forEach(k => { tableStr += "<th>" + k + "</th>"; });
    tableStr += '</tr>';
    data.forEach(row => {
      tableStr += '<tr>';
      Object.values(row).forEach(val => { tableStr += "<td>" + val + "</td>"; });
      tableStr += '</tr>';
    });
    tableStr += '</table></body></html>';

    const blob = new Blob([tableStr], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename + ".xls";
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  };

  const printPDF = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    let html = "<html><head><title>" + filename + "</title><style>" +
      "body { font-family: sans-serif; padding: 20px; text-transform: uppercase; font-size: 12px; }" +
      "table { width: 100%; border-collapse: collapse; margin-top: 10px; }" +
      "th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }" +
      "th { background-color: #f4f4f4; }" +
    "</style></head><body>" +
      "<h2>" + filename + "</h2>" +
      "<table><thead><tr>";

    Object.keys(data[0]).forEach(k => { html += "<th>" + k + "</th>"; });
    html += '</tr></thead><tbody>';

    data.forEach(row => {
      html += '<tr>';
      Object.values(row).forEach(val => { html += "<td>" + (val || '') + "</td>"; });
      html += '</tr>';
    });

    html += '</tbody></table></body></html>';
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <button 
        onClick={() => setOpen(!open)}
        className="brutalist-button brutalist-button--outline" 
        style={{ padding: "0.8rem 1.2rem", fontSize: "0.85rem" }}
      >
        <Download size={15} /> Export
      </button>
      {open && (
        <div style={{
          position: "absolute",
          top: "110%",
          right: 0,
          background: "var(--cl-bg)",
          border: "var(--border-thick)",
          boxShadow: "var(--shadow-brutal-sm)",
          display: "flex",
          flexDirection: "column",
          minWidth: "150px",
          zIndex: 50
        }}>
          <button onClick={downloadCSV} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.85rem", borderBottom: "var(--border-thin)", background:"transparent", border:"none", cursor:"pointer" }}>CSV File</button>
          <button onClick={downloadExcel} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.85rem", borderBottom: "var(--border-thin)", background:"transparent", border:"none", cursor:"pointer" }}>Excel (.xls)</button>
          <button onClick={downloadJSON} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.85rem", borderBottom: "var(--border-thin)", background:"transparent", border:"none", cursor:"pointer" }}>JSON Data</button>
          <button onClick={printPDF} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.85rem", background:"transparent", border:"none", cursor:"pointer" }}>PDF / Print</button>
        </div>
      )}
    </div>
  );
}

import React, { useContext, useRef } from 'react';
import { BillsContext } from '../context/BillsContext';
import { calculateNetBalances, minimizeTransactions } from '../utils/settle';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PrintableBillList from './PrintableBillList';

export default function SettlementSummary() {
  const { bills } = useContext(BillsContext);
  const summaryRef = useRef<HTMLDivElement>(null);

  if (bills.length === 0) return null;

  const net = calculateNetBalances(bills);
  const transactions = minimizeTransactions(net);

  // NEW: Calculate total spent per person
  const totalSpentPerPerson = bills.reduce<Record<string, number>>((acc, bill) => {
    const payer = bill.payer;
    const amount = bill.total;

    if (!acc[payer]) acc[payer] = 0;
    acc[payer] += amount;
    return acc;
  }, {});

  const generatePDF = async () => {
    const element = summaryRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('settlement-summary.pdf');
  };

  return (
    <div className="settlement-summary">
      <div ref={summaryRef} style={{ padding: '16px', background: '#fff', color: '#000' }}>
        <h2>Resumen Completo</h2>

        {/* All bills printed */}
        <PrintableBillList />

        {/* NEW: Total spent per person */}
        <h3 style={{ marginTop: '2rem' }}>Total Gastado por Persona</h3>
        <ul>
          {Object.entries(totalSpentPerPerson).map(([name, amount]) => (
            <li key={name}>
              {name}: ${amount.toFixed(2)}
            </li>
          ))}
        </ul>

        <h3 style={{ marginTop: '2rem' }}>Gastos Totales Individuales (Balance Neto)</h3>
        <ul>
          {Object.entries(net).map(([name, bal]) => (
            <li key={name}>
              {name}: {bal > 0 ? `is owed $${bal.toFixed(2)}` : `owes $${(-bal).toFixed(2)}`}
            </li>
          ))}
        </ul>

        <h3 style={{ marginTop: '1rem' }}>Transacciones</h3>
        <ul>
          {transactions.length === 0
            ? <li>All settled up!</li>
            : transactions.map((t, i) => (
                <li key={i}>
                  {t.from} pays {t.to}: ${t.amount.toFixed(2)}
                </li>
              ))}
        </ul>
      </div>

      <button onClick={generatePDF} style={{ marginTop: '1rem' }}>
        Descargar resumen en PDF
      </button>
    </div>
  );
}

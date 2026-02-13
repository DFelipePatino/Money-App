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
      <h2>Settlement Summary</h2>
      <div ref={summaryRef} className="summary-content">
        <h3>Complete Summary</h3>

        {/* All bills printed */}
        <PrintableBillList />

        {/* Total spent per person */}
        <div className="summary-section">
          <h3>Total Spent per Person</h3>
          <ul className="summary-list">
            {Object.entries(totalSpentPerPerson).map(([name, amount]) => (
              <li key={name} className="summary-item">
                <span>{name}:</span>
                <span className="amount">${amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="summary-section">
          <h3>Net Balances</h3>
          <ul className="summary-list">
            {Object.entries(net).map(([name, bal]) => (
              <li key={name} className={`summary-item ${bal > 0 ? 'owed' : 'owes'}`}>
                <span>{name}:</span>
                <span className="amount">
                  {bal > 0 ? `is owed $${bal.toFixed(2)}` : `owes $${(-bal).toFixed(2)}`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="summary-section">
          <h3>Transactions</h3>
          {transactions.length === 0 ? (
            <p className="settled-message">All settled up! 🎉</p>
          ) : (
            <ul className="summary-list transactions-list">
              {transactions.map((t, i) => (
                <li key={i} className="summary-item transaction-item">
                  <span>{t.from} pays {t.to}:</span>
                  <span className="amount">${t.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <button onClick={generatePDF} className="btn btn-primary btn-download">
        Download PDF Summary
      </button>
    </div>
  );
}

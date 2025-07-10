import React, { useContext } from 'react';
import { BillsContext } from '../context/BillsContext';

export default function PrintableBillList() {
  const { bills } = useContext(BillsContext);

  if (bills.length === 0) return null;

  const groupTotal = bills.reduce((sum, bill) => sum + bill.total, 0);
  const personTotals: { [name: string]: number } = {};
  bills.forEach(bill => {
    bill.splits.forEach(c => {
      personTotals[c.name] = (personTotals[c.name] || 0) + c.amount;
    });
  });

  return (
    <div className="bill-list">
      <h2>Gastos</h2>
      {bills.map(bill => (
        <div key={bill.id} className="bill">
          <strong>{bill.description}</strong> <br />
          <span>Total: ${bill.total.toFixed(2)}</span> <br />
          <span>Perra: {bill.payer}</span> <br />
          <span>Split: {bill.splitType === 'equal' ? 'Equally' : 'Unequally'}</span>
          <ul>
            {bill.splits.map((c, i) => (
              <li key={i}>{c.name}: ${c.amount.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      ))}
      <div className="totals" style={{ marginTop: '1rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
        <strong>Gastos totales como grupo: ${groupTotal.toFixed(2)}</strong>
        <ul style={{ marginTop: '0.5rem' }}>
          {Object.entries(personTotals).map(([name, total]) => (
            <li key={name}>{name}: ${total.toFixed(2)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

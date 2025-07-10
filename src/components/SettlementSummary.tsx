import React, { useContext } from 'react';
import { BillsContext } from '../context/BillsContext';
import { calculateNetBalances, minimizeTransactions } from '../utils/settle';

export default function SettlementSummary() {
  const { bills } = useContext(BillsContext);
  if (bills.length === 0) return null;
  const net = calculateNetBalances(bills);
  const transactions = minimizeTransactions(net);

  return (
    <div className="settlement-summary">
      <h2>Division</h2>
      <h3>Gastos Totales Individuales</h3>
      <ul>
        {Object.entries(net).map(([name, bal]) => (
          <li key={name}>
            {name}: {bal > 0 ? `is owed $${bal.toFixed(2)}` : `owes $${(-bal).toFixed(2)}`}
          </li>
        ))}
      </ul>
      <h3>Transacciones</h3>
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
  );
}

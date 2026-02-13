import React, { useContext } from 'react';
import { BillsContext } from '../context/BillsContext';

export default function BillList() {
  const { bills, removeBill } = useContext(BillsContext);
  return (
    <div className="bill-list">
      <h2>Expenses</h2>
      {bills.length === 0 && <p className="empty-state">No expenses added yet.</p>}
      <div className="bills-grid">
        {bills.map(bill => (
          <div key={bill.id} className="bill-card">
            <div className="bill-header">
              <h3 className="bill-description">{bill.description}</h3>
              <button 
                onClick={() => removeBill(bill.id)}
                className="btn btn-danger btn-sm"
                aria-label={`Remove ${bill.description}`}
              >
                ×
              </button>
            </div>
            <div className="bill-details">
              <div className="bill-detail-row">
                <span className="bill-label">Total:</span>
                <span className="bill-value">${bill.total.toFixed(2)}</span>
              </div>
              <div className="bill-detail-row">
                <span className="bill-label">Paid by:</span>
                <span className="bill-value">{bill.payer}</span>
              </div>
              <div className="bill-detail-row">
                <span className="bill-label">Split:</span>
                <span className="bill-value">{bill.splitType === 'equal' ? 'Equally' : 'Custom'}</span>
              </div>
            </div>
            <div className="bill-splits">
              <strong className="splits-title">Split among:</strong>
              <ul className="splits-list">
                {bill.splits.map((c, i) => (
                  <li key={i} className="split-item">
                    <span>{c.name}</span>
                    <span>${c.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      {/* Totals Section */}
      {bills.length > 0 && (() => {
        // Calculate group total
        const groupTotal = bills.reduce((sum, bill) =>
          sum + bill.total, 0);
        // Calculate individual totals
        const personTotals: { [name: string]: number } = {};
        bills.forEach(bill => {
          bill.splits.forEach(c => {
            personTotals[c.name] = (personTotals[c.name] || 0) + c.amount;
          });
        });
        return (
          <div className="totals">
            <h3>Total Expenses</h3>
            <div className="totals-summary">
              <div className="total-group">
                <span className="total-label">Group Total:</span>
                <span className="total-amount">${groupTotal.toFixed(2)}</span>
              </div>
              <div className="total-individuals">
                <strong>Per Person:</strong>
                <ul>
                  {Object.entries(personTotals).map(([name, total]) => (
                    <li key={name}>
                      <span>{name}:</span>
                      <span>${total.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

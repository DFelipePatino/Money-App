import { Bill } from '../types';

export type NetBalance = { [name: string]: number };
export type Transaction = { from: string; to: string; amount: number };

export function calculateNetBalances(bills: Bill[]): NetBalance {
  const net: NetBalance = {};
  bills.forEach(bill => {
    // The payer pays the total
    net[bill.payer] = (net[bill.payer] || 0) + bill.total;
    // Each person owes their split
    bill.splits.forEach(split => {
      net[split.name] = (net[split.name] || 0) - split.amount;
    });
  });
  return net;
}

// Greedy algorithm to minimize transactions
export function minimizeTransactions(net: NetBalance): Transaction[] {
  const creditors = Object.entries(net)
    .filter(([_, bal]) => bal > 0)
    .sort((a, b) => b[1] - a[1]);
  const debtors = Object.entries(net)
    .filter(([_, bal]) => bal < 0)
    .sort((a, b) => a[1] - b[1]);
  const transactions: Transaction[] = [];
  let i = 0, j = 0;
  while (i < debtors.length && j < creditors.length) {
    const [debtor, debt] = debtors[i];
    const [creditor, credit] = creditors[j];
    const amount = Math.min(-debt, credit);
    if (amount > 0.01) {
      transactions.push({ from: debtor, to: creditor, amount: Math.round(amount * 100) / 100 });
      debtors[i][1] += amount;
      creditors[j][1] -= amount;
    }
    if (Math.abs(debtors[i][1]) < 0.01) i++;
    if (Math.abs(creditors[j][1]) < 0.01) j++;
  }
  return transactions;
}

export type Friend = {
  id: string;
  name: string;
};

export type BillSplit = {
  name: string;
  amount: number;
};

export type Bill = {
  id: string;
  description: string;
  total: number;        // 👈 total amount of the bill
  payer: string;        // 👈 name of the person who paid
  splitType: 'equal' | 'unequal';
  splits: BillSplit[];  // for equal, amounts are auto-calculated
};

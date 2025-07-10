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
  total: number;
  payer: string; // friend's name
  splitType: 'equal' | 'unequal';
  splits: BillSplit[]; // for equal, amounts are auto-calculated
};

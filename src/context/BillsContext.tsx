import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bill } from '../types';

interface BillsContextType {
  bills: Bill[];
  addBill: (bill: Bill) => void;
  removeBill: (id: string) => void;
}

export const BillsContext = createContext<BillsContextType>({
  bills: [],
  addBill: () => {},
  removeBill: () => {},
});

export const BillsProvider = ({ children }: { children: ReactNode }) => {
  const [bills, setBills] = useState<Bill[]>(() => {
    const stored = localStorage.getItem('bills');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('bills', JSON.stringify(bills));
  }, [bills]);

  const addBill = (bill: Bill) => {
    setBills([...bills, bill]);
  };
  const removeBill = (id: string) => {
    setBills(bills.filter(b => b.id !== id));
  };

  return (
    <BillsContext.Provider value={{ bills, addBill, removeBill }}>
      {children}
    </BillsContext.Provider>
  );
}; 
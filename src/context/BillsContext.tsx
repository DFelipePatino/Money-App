import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bill } from '../types';
import { FriendsContext } from './FriendsContext';

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
  const { friends } = useContext(FriendsContext);
  const [bills, setBills] = useState<Bill[]>(() => {
    const stored = localStorage.getItem('bills');
    return stored ? JSON.parse(stored) : [];
  });

  // Clean up bills when friends are removed
  useEffect(() => {
    const friendNames = new Set(friends.map(f => f.name));
    setBills(prevBills => {
      const cleanedBills = prevBills
        .map(bill => {
          // If payer no longer exists, remove this bill
          if (!friendNames.has(bill.payer)) {
            return null;
          }
          
          // Remove splits for friends that no longer exist
          const cleanedSplits = bill.splits.filter(split => friendNames.has(split.name));
          
          // If no splits remain, remove this bill
          if (cleanedSplits.length === 0) {
            return null;
          }
          
          // If splits were removed and it was an equal split, recalculate
          if (bill.splitType === 'equal' && cleanedSplits.length !== bill.splits.length) {
            const share = bill.total / cleanedSplits.length;
            return {
              ...bill,
              splits: cleanedSplits.map(split => ({ name: split.name, amount: Number(share.toFixed(2)) }))
            };
          }
          
          // For custom splits, just remove the deleted friend's split
          return {
            ...bill,
            splits: cleanedSplits
          };
        })
        .filter((bill): bill is Bill => bill !== null);
      
      return cleanedBills;
    });
  }, [friends]);

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
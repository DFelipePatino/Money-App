import React from 'react';
import { FriendsProvider } from './context/FriendsContext';
import { BillsProvider } from './context/BillsContext';
import FriendsManager from './components/FriendsManager';
import BillForm from './components/BillForm';
import BillList from './components/BillList';
import SettlementSummary from './components/SettlementSummary';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>Italia Perras</h1>
      <FriendsProvider>
        <BillsProvider>
          <FriendsManager />
          <BillForm />
          <BillList />
          <SettlementSummary />
        </BillsProvider>
      </FriendsProvider>
    </div>
  );
}

export default App;

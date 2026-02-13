import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { FriendsProvider } from './context/FriendsContext';
import { BillsProvider } from './context/BillsContext';
import FriendsManager from './components/FriendsManager';
import BillForm from './components/BillForm';
import BillList from './components/BillList';
import SettlementSummary from './components/SettlementSummary';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <ThemeToggle />
        <h1>Bill Splitter</h1>
        <FriendsProvider>
          <BillsProvider>
            <FriendsManager />
            <BillForm />
            <BillList />
            <SettlementSummary />
          </BillsProvider>
        </FriendsProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;

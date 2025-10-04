// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Upload from './components/Upload';
import Transactions from './components/Transactions';
import CategoryManagement from './components/CategoryManagement';
import Reports from './components/Reports';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Food & Dining', color: '#FF5733' },
    { id: 2, name: 'Transportation', color: '#33FF57' },
    { id: 3, name: 'Entertainment', color: '#3357FF' },
    { id: 4, name: 'Utilities', color: '#F3FF33' },
    { id: 5, name: 'Shopping', color: '#FF33F6' },
    { id: 6, name: 'Healthcare', color: '#33FFF6' },
    { id: 7, name: 'Income', color: '#8033FF' },
    { id: 8, name: 'Other', color: '#FF8333' },
  ]);

  // Function to add parsed transactions from bank statement
  const addTransactions = (newTransactions) => {
    setTransactions([...transactions, ...newTransactions]);
  };

  // Function to update a transaction's category
  const updateTransactionCategory = (id, categoryId) => {
    setTransactions(
      transactions.map(transaction => 
        transaction.id === id ? { ...transaction, categoryId } : transaction
      )
    );
  };

  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard transactions={transactions} categories={categories} />} />
            <Route path="/upload" element={<Upload addTransactions={addTransactions} categories={categories} />} />
            <Route path="/transactions" element={
              <Transactions 
                transactions={transactions} 
                categories={categories}
                updateCategory={updateTransactionCategory}
              />
            } />
            <Route path="/categories" element={
              <CategoryManagement 
                categories={categories} 
                setCategories={setCategories} 
              />
            } />
            <Route path="/reports" element={<Reports transactions={transactions} categories={categories} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Reports({ transactions, categories }) {
  const [reportType, setReportType] = useState('monthly');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // First day of current year
    end: new Date().toISOString().split('T')[0] // Today
  });

  // Filter transactions by date and category
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      // Date filter
      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      const meetsDateCriteria = transactionDate >= startDate && transactionDate <= endDate;
      
      // Category filter
      const meetsCategoryCriteria = 
        categoryFilter === 'all' || 
        (categoryFilter === 'income' && transaction.amount > 0) ||
        (categoryFilter === 'expense' && transaction.amount < 0) ||
        transaction.categoryId === parseInt(categoryFilter);
      
      return meetsDateCriteria && meetsCategoryCriteria;
    });
  }, [transactions, dateRange, categoryFilter]);

  // Generate report data based on report type
  const reportData = useMemo(() => {
    if (filteredTransactions.length === 0) return [];
    
    if (reportType === 'monthly') {
      const monthlyData = new Map();
      
      filteredTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!monthlyData.has(monthYear)) {
          monthlyData.set(monthYear, {
            name: monthYear,
            income: 0,
            expense: 0
          });
        }
        
        const entry = monthlyData.get(monthYear);
        
        if (transaction.amount > 0) {
          entry.income += transaction.amount;
        } else {
          entry.expense += Math.abs(transaction.amount);
        }
      });
      
      return Array.from(monthlyData.values())
        .sort((a, b) => {
          const [aMonth, aYear] = a.name.split('/').map(Number);
          const [bMonth, bYear] = b.name.split('/').map(Number);
          
          if (aYear !== bYear) return aYear - bYear;
          return aMonth - bMonth;
        });
    } else if (reportType === 'category') {
      const categoryData = new Map();
      
      categories.forEach(category => {
        categoryData.set(category.id, {
          name: category.name,
          value: 0,
          color: category.color
        });
      });
      
      // Add uncategorized
      categoryData.set(null, {
        name: 'Uncategorized',
        value: 0,
        color: '#cccccc'
      });
      
      filteredTransactions.forEach(transaction => {
        if (transaction.amount < 0) { // Only track expenses for category breakdown
          const amount = Math.abs(transaction.amount);
          const categoryId = transaction.categoryId;
          
          if (categoryData.has(categoryId)) {
            const entry = categoryData.get(categoryId);
            entry.value += amount;
          }
        }
      });
      
      // Filter out categories with zero value
      return Array.from(categoryData.values())
        .filter(item => item.value > 0)
        .sort((a, b) => b.value - a.value);
    }
    
    return [];
  }, [filteredTransactions, reportType, categories]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpense = filteredTransactions
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    return {
      totalIncome,
      totalExpense,
      netSavings: totalIncome - totalExpense,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100) : 0
    };
  }, [filteredTransactions]);

  return (
    <div className="reports-container">
      <h2>Financial Reports</h2>
      
      <div className="report-controls">
        <div className="control-group">
          <label>Report Type:</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="monthly">Monthly Income/Expense</option>
            <option value="category">Expense by Category</option>
          </select>
        </div>
        
        <div className="control-group">
          <label>Filter by:</label>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name} Only
              </option>
            ))}
          </select>
        </div>
        
        <div className="date-range">
          <div className="control-group">
            <label>Start Date:</label>
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
          </div>
          
          <div className="control-group">
            <label>End Date:</label>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>
      </div>
      
      <div className="summary-section">
        <div className="summary-card">
          <h3>Total Income</h3>
          <p className="positive">${summary.totalIncome.toFixed(2)}</p>
        </div>
        
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p className="negative">${summary.totalExpense.toFixed(2)}</p>
        </div>
        
        <div className="summary-card">
          <h3>Net Savings</h3>
          <p className={summary.netSavings >= 0 ? 'positive' : 'negative'}>
            ${summary.netSavings.toFixed(2)}
          </p>
        </div>
        
        <div className="summary-card">
          <h3>Savings Rate</h3>
          <p className={summary.savingsRate >= 0 ? 'positive' : 'negative'}>
            {summary.savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>
      
      <div className="report-chart">
        {reportData.length > 0 ? (
          reportType === 'monthly' ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="income" fill="#4CAF50" name="Income" />
                <Bar dataKey="expense" fill="#F44336" name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Amount" 
                  fill="#8884d8"
                  // Use category colors
                  {...{ fill: "" }} // This is needed to override recharts default
                >
                {reportData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )
        ) : (
          <p>No data available for the selected filters</p>
        )}
      </div>

      {reportType === 'monthly' && reportData.length > 0 && (
        <div className="trend-chart">
          <h3>Savings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#4CAF50"
                name="Income"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#F44336"
                name="Expense"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Reports;
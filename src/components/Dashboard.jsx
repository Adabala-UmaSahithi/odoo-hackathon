import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Dashboard({ transactions, categories }) {
  // Calculate total expenses by category
  const expensesByCategory = useMemo(() => {
    const categoryMap = new Map();
    
    transactions.forEach(transaction => {
      if (transaction.amount < 0) { // Only consider expenses (negative amounts)
        const categoryId = transaction.categoryId || 8; // Default to "Other" if uncategorized
        const categoryName = categories.find(c => c.id === categoryId)?.name || 'Uncategorized';
        const amount = Math.abs(transaction.amount);
        
        if (categoryMap.has(categoryName)) {
          categoryMap.set(categoryName, categoryMap.get(categoryName) + amount);
        } else {
          categoryMap.set(categoryName, amount);
        }
      }
    });
    
    return Array.from(categoryMap, ([name, value]) => ({ name, value }));
  }, [transactions, categories]);

  // Calculate monthly expenses
  const monthlyExpenses = useMemo(() => {
    const monthMap = new Map();
    
    transactions.forEach(transaction => {
      if (transaction.amount < 0) { // Only consider expenses
        const date = new Date(transaction.date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        const amount = Math.abs(transaction.amount);
        
        if (monthMap.has(monthYear)) {
          monthMap.set(monthYear, monthMap.get(monthYear) + amount);
        } else {
          monthMap.set(monthYear, amount);
        }
      }
    });
    
    return Array.from(monthMap, ([name, value]) => ({ name, value }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.name.split('/');
        const [bMonth, bYear] = b.name.split('/');
        
        if (aYear !== bYear) return aYear - bYear;
        return aMonth - bMonth;
      });
  }, [transactions]);

  // Calculate total balance
  const totalBalance = useMemo(() => {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  }, [transactions]);

  // Get category colors for pie chart
  const getCategoryColor = (index) => {
    const category = categories.find(c => c.name === expensesByCategory[index].name);
    return category ? category.color : '#ccc';
  };

  return (
    <div className="dashboard">
      <div className="summary-cards">
        <div className="card">
          <h3>Total Balance</h3>
          <p className={totalBalance >= 0 ? 'positive' : 'negative'}>
            ${totalBalance.toFixed(2)}
          </p>
        </div>
        <div className="card">
          <h3>Total Transactions</h3>
          <p>{transactions.length}</p>
        </div>
        <div className="card">
          <h3>Categories</h3>
          <p>{categories.length}</p>
        </div>
      </div>

      <div className="charts">
        <div className="chart-container">
          <h3>Expenses by Category</h3>
          {expensesByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expensesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getCategoryColor(index)} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No expense data available</p>
          )}
        </div>

        <div className="chart-container">
          <h3>Monthly Expenses</h3>
          {monthlyExpenses.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyExpenses}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No monthly data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


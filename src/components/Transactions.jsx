import React, { useState, useMemo } from 'react';

function Transactions({ transactions, categories, updateCategory }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === '' || transaction.categoryId === parseInt(filterCategory);
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortConfig.key === 'date') {
          return sortConfig.direction === 'asc' 
            ? new Date(a.date) - new Date(b.date)
            : new Date(b.date) - new Date(a.date);
        } else if (sortConfig.key === 'amount') {
          return sortConfig.direction === 'asc' 
            ? a.amount - b.amount
            : b.amount - a.amount;
        }
        return 0;
      });
  }, [transactions, searchTerm, filterCategory, sortConfig]);

  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="transactions-container">
      <h2>Transactions</h2>
      
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="category-filter">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredTransactions.length > 0 ? (
        <table className="transactions-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('date')}>
                Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Description</th>
              <th onClick={() => requestSort('amount')}>
                Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.description}</td>
                <td className={transaction.amount >= 0 ? 'positive' : 'negative'}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td>
                  <select
                    value={transaction.categoryId || ''}
                    onChange={(e) => updateCategory(transaction.id, parseInt(e.target.value))}
                    style={{
                      backgroundColor: transaction.categoryId 
                        ? categories.find(c => c.id === transaction.categoryId)?.color 
                        : 'white',
                      color: transaction.categoryId ? 'white' : 'black'
                    }}
                  >
                    <option value="">Uncategorized</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No transactions found</p>
      )}
    </div>
  );
}

export default Transactions;
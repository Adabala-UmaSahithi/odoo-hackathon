import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <h1>Expense Tracker</h1>
      <ul className="nav-links">
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/upload">Upload Statement</Link></li>
        <li><Link to="/transactions">Transactions</Link></li>
        <li><Link to="/categories">Categories</Link></li>
        <li><Link to="/reports">Reports</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;

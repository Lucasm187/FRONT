import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Books from './components/Books';
import Cart from './components/Cart';
import Account from './components/Account';
import Admin from './components/Admin'; 
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth(); 

 
  const isAdmin = user && user.email === 'admin@mail.com' && user.password === 'admin123';

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">LM Books</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/books">Livros</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/cart">Carrinho</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/account">Conta</Link>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Admin</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/account" element={<Account />} />
        <Route
          path="/admin"
          element={isAdmin ? <Admin /> : <Navigate to="/account" />}
        />
      </Routes>
    </Router>
  );
}

export default App;

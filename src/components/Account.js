import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Account() {
  const { user, login, logout } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (user) {
      fetchPurchases(user.id); 
    }
  }, [user]);

  const handleLogin = () => {
    api.post('/api/users/login', { email, password })
      .then((response) => {
        login({ ...response.data, password }); 
        fetchPurchases(response.data.id); 
        alert('Login bem-sucedido!');
        setEmail('');
        setPassword('');
      })
      .catch(() => {
        alert('Falha no login. Verifique suas credenciais.');
      });
  };

  const handleRegister = () => {
    api.post('/api/users', { email, password })
      .then(() => {
        alert('Conta criada com sucesso! Faça login para continuar.');
        setEmail('');
        setPassword('');
      })
      .catch(() => {
        alert('Erro ao criar conta. Tente novamente.');
      });
  };

  const fetchPurchases = (userId) => {
    api.get(`/api/users/${userId}/purchases`)
      .then((response) => {
        setPurchases(response.data);
      })
      .catch(() => {
        alert('Erro ao buscar compras.');
      });
  };

  const handleLogout = () => {
    logout(); 
    setPurchases([]); 
    alert('Você saiu da conta.');
  };

  return (
    <div className="container mt-5">
      {user ? (
        <>
          <h1 className="text-center mb-4">{user.email}</h1>
          <div className="text-center">
            <p><strong>Total de Compras:</strong> R$ {purchases.reduce((total, purchase) => total + purchase.total, 0).toFixed(2)}</p>
          </div>
          <h2 className="mt-5">Minhas Compras</h2>
          {purchases.length === 0 ? (
            <p className="text-center">Nenhuma compra encontrada.</p>
          ) : (
            <ul className="list-group mt-3">
              {purchases.map((purchase) => (
                <li key={purchase.id} className="list-group-item">
                  <strong>Compra #{purchase.id}</strong> - R$ {purchase.total.toFixed(2)}
                  <ul className="mt-2">
                    {purchase.books.map((book) => (
                      <li key={book.id}>{book.title}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
          <div className="text-center mt-5">
            <button className="btn btn-danger" onClick={handleLogout}>Sair da Conta</button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-center mb-4">Minha Conta</h1>
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-primary" onClick={handleLogin}>Entrar</button>
            <button className="btn btn-secondary ml-2" onClick={handleRegister}>Criar Conta</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Account;

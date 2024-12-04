import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();

  const finalizePurchase = () => {
    if (!user) {
      alert('Você precisa estar logado para finalizar a compra.');
      return;
    }

    const purchaseData = {
      books: cart.map((book) => ({ id: book.id })), // Apenas os IDs dos livros
      total: cart.reduce((total, item) => total + item.price, 0), // Calcula o total
    };

    api.post(`/api/purchases/${user.id}`, purchaseData)
      .then(() => {
        alert('Compra finalizada com sucesso!');
        clearCart(); // Limpa o carrinho
      })
      .catch((error) => {
        console.error('Erro ao finalizar compra:', error);
        alert('Erro ao finalizar a compra. Tente novamente.');
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Seu Carrinho</h1>
      {cart.length === 0 ? (
        <p className="text-center">O carrinho está vazio.</p>
      ) : (
        <ul className="list-group">
          {cart.map((item) => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              {item.title}
              <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>Remover</button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 text-center">
        <strong>Total:</strong> R$ {cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
      </div>
      <div className="text-center mt-4">
        <button className="btn btn-success" onClick={finalizePurchase}>Finalizar Compra</button>
      </div>
    </div>
  );
}

export default Cart;

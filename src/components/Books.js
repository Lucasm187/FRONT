import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Books() {
  const [books, setBooks] = useState([]);
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    api.get('/api/books')
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar livros:', error);
      });
  }, []);

  const handleAddToCart = (book) => {
    if (!isLoggedIn()) {
      alert('Faça login para adicionar livros ao carrinho.');
      return;
    }
    addToCart(book);
    alert(`${book.title} foi adicionado ao carrinho.`);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Nossos Livros</h1>
      <div className="row">
        {books.map((book) => (
          <div className="col-md-4 mb-4" key={book.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text"><strong>Descrição:</strong> {book.description}</p>
                <p><strong>Autor:</strong> {book.author}</p>
                <p><strong>Categoria:</strong> {book.category.name}</p>
                <p><strong>Editora:</strong> {book.publisher.name}</p>
                <p><strong>Preço:</strong> R$ {book.price.toFixed(2)}</p>
                <button className="btn btn-primary" onClick={() => handleAddToCart(book)}>
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Books;
import React, { useEffect, useState } from 'react';
import api from '../services/api';

function Admin() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    category: '',
    publisher: '',
    price: ''
  });

  const [categoryName, setCategoryName] = useState('');
  const [publisherName, setPublisherName] = useState('');
  
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    api.get('/api/books')
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar livros:', error);
      });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddBook = () => {
    const payload = {
      title: formData.title,
      description: formData.description,
      author: formData.author,
      category: { id: parseInt(formData.category, 10) }, 
      publisher: { id: parseInt(formData.publisher, 10) },
      price: parseFloat(formData.price) 
    };
  
    api.post('/api/books', payload)
      .then(() => {
        alert('Livro adicionado com sucesso!');
        fetchBooks();
        setFormData({ title: '', description: '', author: '', category: '', publisher: '', price: '' });
      })
      .catch((error) => {
        console.error('Erro ao adicionar livro:', error.response?.data || error.message);
        alert('Erro ao adicionar livro.');
      });
  };
  
  const handleEditBook = () => {
    const payload = {
      title: formData.title,
      description: formData.description,
      author: formData.author,
      category: { id: parseInt(formData.category, 10) }, 
      publisher: { id: parseInt(formData.publisher, 10) }, 
      price: parseFloat(formData.price) 
    };
  
    api.put(`/api/books/${editingBook.id}`, payload)
      .then(() => {
        alert('Livro atualizado com sucesso!');
        fetchBooks(); 
        setEditingBook(null);
        setFormData({ title: '', description: '', author: '', category: '', publisher: '', price: '' });
      })
      .catch((error) => {
        console.error('Erro ao editar livro:', error.response?.data || error.message);
        alert('Erro ao editar livro.');
      });
  };
  

  const handleDeleteBook = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este livro?')) {
      api.delete(`/api/books/${id}`)
        .then(() => {
          alert('Livro excluído com sucesso!');
          fetchBooks(); 
        })
        .catch((error) => {
          console.error('Erro ao excluir livro:', error);
          alert('Erro ao excluir livro.');
        });
    }
  };

  const startEditing = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      description: book.description,
      author: book.author,
      category: book.category?.id || '',
      publisher: book.publisher?.id || '',
      price: book.price
    });
  };

  const handleAddCategory = () => {
    if (!categoryName) {
      alert('Por favor, insira o nome da categoria.');
      return;
    }

    api.post('/api/categories', { name: categoryName })
      .then(() => {
        alert('Categoria adicionada com sucesso!');
        setCategoryName('');
      })
      .catch((error) => {
        console.error('Erro ao adicionar categoria:', error.response?.data || error.message);
        alert('Erro ao adicionar categoria.');
      });
  };

  const handleAddPublisher = () => {
    if (!publisherName) {
      alert('Por favor, insira o nome da editora.');
      return;
    }

    api.post('/api/publishers', { name: publisherName })
      .then(() => {
        alert('Editora adicionada com sucesso!');
        setPublisherName('');
      })
      .catch((error) => {
        console.error('Erro ao adicionar editora:', error.response?.data || error.message);
        alert('Erro ao adicionar editora.');
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Painel Administrativo</h1>
  
      {/* Formulário para adicionar/editar livros */}
      <div className="card mb-4">
        <div className="card-body">
          <h2>{editingBook ? 'Editar Livro' : 'Adicionar Livro'}</h2>
          <form>
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Autor</label>
              <input
                type="text"
                className="form-control"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Categoria (ID)</label>
              <input
                type="text"
                className="form-control"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Editora (ID)</label>
              <input
                type="text"
                className="form-control"
                name="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Preço</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </div>
          </form>
          <button
            className="btn btn-primary mt-3"
            onClick={editingBook ? handleEditBook : handleAddBook}
          >
            {editingBook ? 'Atualizar Livro' : 'Adicionar Livro'}
          </button>
          {editingBook && (
            <button
              className="btn btn-secondary mt-3 ml-2"
              onClick={() => {
                setEditingBook(null);
                setFormData({ title: '', description: '', author: '', category: '', publisher: '', price: '' });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
  
      {/* Formulário para Adicionar Categoria */}
      <div className="card mb-4">
        <div className="card-body">
          <h2>Adicionar Categoria</h2>
          <div className="form-group">
            <label>Nome da Categoria</label>
            <input
              type="text"
              className="form-control"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <button className="btn btn-success mt-3" onClick={handleAddCategory}>
            Adicionar Categoria
          </button>
        </div>
      </div>
  
      {/* Formulário para Adicionar Editora */}
      <div className="card mb-4">
        <div className="card-body">
          <h2>Adicionar Editora</h2>
          <div className="form-group">
            <label>Nome da Editora</label>
            <input
              type="text"
              className="form-control"
              value={publisherName}
              onChange={(e) => setPublisherName(e.target.value)}
            />
          </div>
          <button className="btn btn-success mt-3" onClick={handleAddPublisher}>
            Adicionar Editora
          </button>
        </div>
      </div>
  
      {/* Lista de livros */}
      <h2>Livros Cadastrados</h2>
      <ul className="list-group">
        {books.map((book) => (
          <li key={book.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>
              <strong>{book.title}</strong> - {book.author} | {book.category?.name || 'Sem categoria'} | {book.publisher?.name || 'Sem editora'}
            </span>
            <div>
              <button
                className="btn btn-warning btn-sm mr-2"
                onClick={() => startEditing(book)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDeleteBook(book.id)}
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
  
}

export default Admin;

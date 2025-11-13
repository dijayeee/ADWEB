import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { getBooks } from '../api';
import './Books.css';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data } = await getBooks();
      setBooks(data);
    } catch (err) {
      setError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="books-container">
      <h2>📚 Books Library</h2>
      {user?.role === 'admin' && (
        <a href="/admin" className="btn-admin">
          Add Book (Admin)
        </a>
      )}
      <div className="books-grid">
        {books.length === 0 ? (
          <p>No books available.</p>
        ) : (
          books.map((book) => (
            <div key={book._id} className="book-card">
              <h3>{book.title}</h3>
              <p>
                <strong>Author:</strong> {book.author || 'Unknown'}
              </p>
              <p>{book.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

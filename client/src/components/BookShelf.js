import React, { useState, useEffect } from 'react';
import '../components/styles/BookShelf.css'; // Add this file for custom styles

const BookShelf = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch books from the Gutenberg API
  const fetchBooks = async () => {
    try {
      const response = await fetch(
        `https://gutendex.com/books?languages=en&limit=50`
      );
      const data = await response.json();

      // Extract relevant information from the Gutenberg API response
      const booksData = data.results.map((item) => ({
        id: item.id,
        title: item.title,
        author: item.authors.length > 0 ? item.authors[0].name : 'Unknown Author',
        genre: item.subjects.length > 0 ? item.subjects[0] : 'Unknown Genre',
        cover: item.formats['image/jpeg'] || 'https://via.placeholder.com/100x150?text=No+Cover',
      }));

      setBooks(booksData);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="bookshelf-container">
      <div className="book-details">
        {selectedBook ? (
          <div className="bookshelf-detail-card">
            <div className="detail-cover-wrapper">
              <img src={selectedBook.cover} alt={selectedBook.title} className="book-detail-cover" />
            </div>
            <div className="detail-meta">
              <h3 className="detail-title">{selectedBook.title}</h3>
              <p className="detail-author"><strong>By</strong> {selectedBook.author}</p>
              <span className="genre-tag">{selectedBook.genre}</span>
            </div>
          </div>
        ) : (
          <div className="bookshelf-empty-detail">
            <span className="explore-emoji">📖</span>
            <p>Hover over a book on the shelf to view details</p>
          </div>
        )}
      </div>
      <div className="bookshelf">
        {loading ? (
          <div className="bookshelf-skeleton">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bookshelf-row-skeleton" />
            ))}
          </div>
        ) : (
          Array.from({ length: 5 }).map((_, rowIndex) => (
            <div key={rowIndex} className="bookshelf-row-wrapper">
              <div className="bookshelf-row">
                {books.slice(rowIndex * 10, (rowIndex + 1) * 10).map(book => (
                  <div
                    key={book.id}
                    className="book-item"
                    onMouseEnter={() => setSelectedBook(book)}
                    onMouseLeave={() => setSelectedBook(null)}
                  >
                    <img src={book.cover} alt={book.title} />
                  </div>
                ))}
              </div>
              <div className="shelf-board" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookShelf;

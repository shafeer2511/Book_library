import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/styles/BookCard.css';

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  
  const handleBookClick = () => {
    navigate(`/book/${book.id}`, { state: { book } }); // Navigate to BookDetails with book data
  };

  return (
    <div className="book-cards" onClick={handleBookClick}>
      <div className="book-cover-wrapper">
        <img src={book.cover} alt={book.title} className="book-cover" />
        <div className="book-card-overlay">
          <span className="book-card-btn">📖 View Details</span>
        </div>
      </div>
      <div className="book-info">
        <div className="book-title" title={book.title}>{book.title}</div>
        <div className="book-author">{book.author}</div>
      </div>
    </div>
  );
};

export default BookCard;

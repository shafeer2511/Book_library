import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookCard from './BookCard';
import BookShelf from './BookShelf';
import RecommendedBooksCarousel from './RecommendedBooksCarousel';
import styles from './Home.module.css'; // Import the CSS module
import Footer from './Footer';

export const  Home = ({ filteredBooks, fetchBooks }) => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const booksPerPage = 10;

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
    fetchBooks('', (page * booksPerPage)); // Adjust fetchBooks to start from the next set of results
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
      fetchBooks('', ((page - 2) * booksPerPage));
    }
  };

  return (
    <div className={styles.homeContainer}>
      <section className={styles.carouselSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>✨ Recommended Reading</h2>
          <p className={styles.sectionSubtitle}>Hand-curated favorites just for you</p>
        </div>
        <RecommendedBooksCarousel />
      </section>

      <section className={styles.shelfSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>📚 Virtual Bookshelf</h2>
          <p className={styles.sectionSubtitle}>Hover over a book on the shelf to explore its details</p>
        </div>
        <BookShelf />
      </section>

      <section className={styles.exploreSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🔍 Explore Books</h2>
          <p className={styles.sectionSubtitle}>Showing {filteredBooks.length} books on page {page}</p>
        </div>

        <div className="book-cards-container">
          {filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                onBookClick={(selectedBook) => navigate(`/book/${selectedBook.id}`, { state: { book: selectedBook } })}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📖</span>
              <h3>No books found</h3>
              <p>Try searching for a different title, author, or genre in the search bar above.</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        <div className={styles.paginationContainer}>
          <div className={styles.pagination}>
            <button 
              onClick={handlePreviousPage} 
              disabled={page === 1}
              className={styles.pageButton}
            >
              Previous
            </button>
            <span className={styles.pageNumber}>Page {page}</span>
            <button 
              onClick={handleNextPage}
              className={styles.pageButton}
            >
              Next
            </button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

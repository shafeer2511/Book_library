import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles/CollectionDetail.css';
import ConfirmationModal from './ConfirmationModal'; // Assuming this is the modal component
import Footer from './Footer';

const CollectionDetail = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const googleBooksApiKey = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;

  useEffect(() => {
    const fetchCollectionDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/collections/${collectionId}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });

        if (response.status === 403) {
          setError("This collection is private and can't be accessed.");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch collection details.");
        }

        const data = await response.json();
        setCollection(data.collection);
        setIsOwner(data.isOwner);

        const bookDetails = await Promise.all(
          data.collection.book_ids.map(async (bookId) => {
            const bookResponse = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${googleBooksApiKey}`);
            const bookData = await bookResponse.json();
            const bookInfo = bookData.volumeInfo;

            return {
              id: bookData.id,
              title: bookInfo.title,
              author: bookInfo.authors ? bookInfo.authors.join(', ') : "Unknown Author",
              genre: bookInfo.categories ? bookInfo.categories.join(', ') : "Unknown Genre",
              description: bookInfo.description || "Description not available.",
              cover: bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150',
              publicationDate: bookInfo.publishedDate || "Unknown Year",
              language: bookInfo.language ? bookInfo.language.toUpperCase() : "Unknown Language",
            };
          })
        );

        setBooks(bookDetails);
      } catch (error) {
        console.error("Error fetching collection details:", error);
        setError("An error occurred while fetching the collection details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionDetails();
  }, [collectionId]);

  const handleDeleteCollection = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/collections/${collectionId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Collection deleted successfully!");
        navigate('/profile');
      } else {
        alert("Failed to delete the collection.");
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      alert("An error occurred while trying to delete the collection.");
    }
  };

 const handleRemoveBook = async (bookId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to remove this book from the collection?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `http://localhost:5000/api/collections/${collectionId}/book/${bookId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      alert("Book removed from collection!");
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== bookId)
      );
    } else {
      const data = await response.json();
      alert(data.message || "Failed to remove the book from the collection.");
    }
  } catch (error) {
    console.error("Error removing book from collection:", error);
    alert("An error occurred while trying to remove the book.");
  }
};


  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Collection URL copied to clipboard!");
    navigate(`/collections/${collectionId}`);
  };

  const showConfirmationModal = () => setShowModal(true);
  const closeConfirmationModal = () => setShowModal(false);

  return (
    <div className="collection-detail-page">
      {error ? (
        <div className="collection-error-container">
          <p className="error-message">🔒 {error}</p>
        </div>
      ) : (
        <div className="collection-detail-container">
          <div className="collection-detail-header">
            <div className="collection-meta-top">
              <span className="collection-detail-badge">
                {collection?.visibility === 'private' ? '🔒 Private List' : '🌐 Public List'}
              </span>
            </div>
            <h2>{collection?.collection_name}</h2>
            <p className="collection-detail-desc">{collection?.description || 'No description provided.'}</p>
            
            <div className="collection-detail-actions">
              <button onClick={handleCopyLink} className="copy-url-btn">
                🔗 Copy URL Link
              </button>
              {isOwner && (
                <button onClick={showConfirmationModal} className="delete-collection-btn">
                  🗑️ Delete Collection
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="collection-books-loading">
              <p>Loading books in collection...</p>
            </div>
          ) : (
            <div className="collection-books-wrapper">
              <h3 className="section-title">Books in this list ({books.length})</h3>
              
              {books.length > 0 ? (
                <div className="books-list">
                  {books.map((book) => (
                    <div 
                      key={book.id} 
                      className="collection-book-card" 
                      onClick={() => navigate(`/book/${book.id}`, { state: { book } })}
                    >
                      <div className="collection-book-cover-wrapper">
                        <img src={book.cover} alt={book.title} className="collection-book-cover" />
                        {isOwner && (
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleRemoveBook(book.id); 
                            }} 
                            className="remove-book-btn"
                            title="Remove from list"
                          >
                            ✕ Remove
                          </button>
                        )}
                      </div>
                      <div className="collection-book-info">
                        <div className="collection-book-title" title={book.title}>{book.title}</div>
                        <div className="collection-book-author">{book.author}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="collection-empty-books">
                  <span className="empty-book-emoji">📚</span>
                  <h4>This collection is empty</h4>
                  <p>Browse books and add them to this list to customize your collection.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        showModal={showModal}
        onClose={closeConfirmationModal}
        onConfirm={handleDeleteCollection}
      />
      <Footer />
    </div>
  );
};

export default CollectionDetail;

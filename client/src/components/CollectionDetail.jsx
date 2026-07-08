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
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/collections/${collectionId}/book/${bookId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Book removed from collection!");
        setBooks(books.filter((book) => book.id !== bookId));
      } else {
        alert("Failed to remove the book from the collection.");
      }
    } catch (error) {
      console.error("Error removing book from collection:", error);
      alert("An error occurred while trying to remove the book.");
    }
  };

  const showConfirmationModal = () => setShowModal(true);
  const closeConfirmationModal = () => setShowModal(false);

  return (
    <div className="collection-detail-page">
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <>
          <h2>{collection?.collection_name}</h2>
          <button onClick={() => navigate(`/collections/${collectionId}`)}>Copy Collection URL</button>
          <p>{collection?.description}</p>

          {isOwner && (
            <button onClick={showConfirmationModal} className="delete-collection-btn">
              Delete Collection
            </button>
          )}

          {loading ? (
            <p>Loading books...</p>
          ) : (
            
            <div className="books-list">
              {books.length > 0 ? (
                books.map((book) => (
                  <div key={book.id} className="book-card" onClick={() => navigate(`/book/${book.id}`, { state: { book } })}>
                    <img src={book.cover} alt={book.title} className="book-cover" />
                    <div className="book-info">
                      <div className="book-title">{book.title}</div>
                      <div className="book-author">Author: {book.author}</div>
                    </div>
                    {isOwner && (
                      <button onClick={(e) => { e.stopPropagation(); handleRemoveBook(book.id); }} className="remove-book-btn">
                        Remove from Collection
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p>No books in this collection.</p>
              )}
            </div>
          )}
        </>
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

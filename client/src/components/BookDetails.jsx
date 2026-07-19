import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from './Loading';
import ReviewSection from './ReviewSection';
import { useTheme } from '../components/ThemeContext'; // Import useTheme
import './styles/BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [newCollectionForm, setNewCollectionForm] = useState({ collection_name: "", description: "", visibility: "private" });
  const [showNewCollectionForm, setShowNewCollectionForm] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const navigate = useNavigate();
  const googleBooksApiKey = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;

  const { theme } = useTheme(); // Get the current theme from context

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}?key=${googleBooksApiKey}`);
        const data = await response.json();
        const bookInfo = data.volumeInfo;
        setBook({
          id: data.id,
          title: bookInfo.title,
          author: bookInfo.authors ? bookInfo.authors.join(', ') : "Unknown Author",
          genre: bookInfo.categories ? bookInfo.categories.join(', ') : "Unknown Genre",
          description: bookInfo.description || "Description not available.",
          cover: bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150',
          languages: bookInfo.language ? bookInfo.language.toUpperCase() : "Unknown Language",
          publicationDate: bookInfo.publishedDate || "Unknown Year",
          pageCount: bookInfo.pageCount || "Unknown Page Count",
          publisher: bookInfo.publisher || "Unknown Publisher",
          previewLink: bookInfo.previewLink || null,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setLoading(false);
      }
    };

    const fetchUserCollections = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/collections`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchBookDetails();
    fetchUserCollections();
  }, [id]);

  const handleAddBookToCollections = async () => {
    if (collections.length === 0) {
      alert("Create a collection first.");
      return;
    }

    if (selectedCollections.length === 0) {
      alert("Please select at least one collection.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        selectedCollections.map(async (collectionId) => {
          await fetch(`http://localhost:5000/api/collections/${collectionId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ book_ids: [book.id] }),
          });
        })
      );
      alert("Book added to selected collections successfully!");
      setSelectedCollections([]);
      setShowCollectionForm(false);
    } catch (error) {
      console.error("Error adding book to collections:", error);
    }
  };

  const handleCreateNewCollection = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/collections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newCollectionForm, book_ids: [book.id] }),
      });
      const newCollection = await response.json();
      setCollections([...collections, newCollection]);
      setShowNewCollectionForm(false);
      setShowCollectionForm(false);
      alert("New collection created successfully!");
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  const toggleCollectionSelection = (collectionId) => {
    setSelectedCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return (
      <div className="stars-container" title={`Rating: ${rating}/5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`star-item ${i < rounded ? 'filled' : ''}`}>★</span>
        ))}
        <span className="rating-numeric">({rating ? Number(rating).toFixed(1) : '0.0'})</span>
      </div>
    );
  };

  if (loading) return <Loading />;
  if (!book) return <div className="book-not-found"><p>Book not found</p></div>;

  return (
    <div className={`book-details-page-wrapper ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="book-details-main-grid">
        <div className="book-cover-column">
          <div className="cover-card-container">
            <img src={book.cover} alt={book.title} className="book-detail-main-cover" />
          </div>
          {book.previewLink && (
            <a href={book.previewLink} target="_blank" rel="noopener noreferrer" className="preview-link-btn">
              📖 Preview Book
            </a>
          )}
        </div>

        <div className="book-info-column">
          <h1 className="book-detail-title">{book.title}</h1>
          <div className="book-detail-rating-row">
            {renderStars(averageRating)}
          </div>

          <div className="metadata-pills">
            <span className="meta-pill author-pill">✍️ {book.author}</span>
            <span className="meta-pill category-pill">🏷️ {book.genre}</span>
            <span className="meta-pill pages-pill">📄 {book.pageCount} Pages</span>
          </div>

          <div className="book-technical-details">
            <div className="tech-item">
              <span className="tech-label">Publisher</span>
              <span className="tech-val">{book.publisher}</span>
            </div>
            <div className="tech-item">
              <span className="tech-label">Published Date</span>
              <span className="tech-val">{book.publicationDate}</span>
            </div>
            <div className="tech-item">
              <span className="tech-label">Language</span>
              <span className="tech-val">{book.languages}</span>
            </div>
          </div>

          <div className="description-section">
            <h3>Description</h3>
            <div className="description-body" dangerouslySetInnerHTML={{ __html: book.description }} />
          </div>

          <div className="collection-actions-container">
            <button
              className={`collection-toggle-btn ${showCollectionForm ? 'active' : ''}`}
              onClick={() => {
                if (localStorage.getItem("token")) setShowCollectionForm((prev) => !prev);
                else {
                  alert("You need to login to add this book to a collection");
                  navigate("/auth");
                }
              }}
            >
              {showCollectionForm ? "✕ Cancel" : "📁 Add to Collection"}
            </button>

            {showCollectionForm && (
              <div className="collections-popover animate-slide-up">
                <h4>Select Collections</h4>
                <div className="collections-list">
                  {collections.length > 0 ? (
                    collections.map((collection) => (
                      <div
                        key={collection._id}
                        className={`collection-item-selection ${selectedCollections.includes(collection._id) ? 'selected' : ''}`}
                        onClick={() => toggleCollectionSelection(collection._id)}
                      >
                        <input
                          type="checkbox"
                          className="collection-checkbox-custom"
                          checked={selectedCollections.includes(collection._id)}
                          onChange={() => { }} // Handle inside parent click
                        />
                        <span className="collection-label-custom">{collection.collection_name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="no-collections-alert">No collections available yet.</p>
                  )}
                </div>
                <div className="popover-actions">
                  <button onClick={handleAddBookToCollections} className="confirm-add-btn">
                    Confirm Add
                  </button>
                  <button onClick={() => setShowNewCollectionForm(true)} className="create-new-trigger-btn">
                    + Create New Collection
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showNewCollectionForm && (
        <div className="modal-overlay" onClick={() => setShowNewCollectionForm(false)}>
          <div className="modal-content animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <h3>Create New Collection</h3>
            <div className="form-group">
              <input
                type="text"
                placeholder="Collection Name"
                value={newCollectionForm.collection_name}
                onChange={(e) => setNewCollectionForm({ ...newCollectionForm, collection_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <textarea
                placeholder="Description"
                value={newCollectionForm.description}
                onChange={(e) => setNewCollectionForm({ ...newCollectionForm, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <select
                value={newCollectionForm.visibility}
                onChange={(e) => setNewCollectionForm({ ...newCollectionForm, visibility: e.target.value })}
              >
                <option value="private">🔒 Private</option>
                <option value="public">🌐 Public</option>
              </select>
            </div>
            <div className="modal-actions">
              <button onClick={handleCreateNewCollection} className="modal-save-btn">Create</button>
              <button className="modal-close-btn" onClick={() => setShowNewCollectionForm(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className={`review-section-wrapper ${theme === 'dark' ? 'dark' : ''}`}>
        <ReviewSection bookId={book.id} setAverageRating={setAverageRating} />
      </div>
    </div>
  );
};

export default BookDetails;

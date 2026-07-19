// components/Loading.jsx
import React from 'react';
import './styles/Loading.css';

const Loading = () => {
  return (
    <div className="loading-container">
      <div className="skeleton-grid">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-image-wrapper shimmer"></div>
            <div className="skeleton-info">
              <div className="skeleton-text title shimmer"></div>
              <div className="skeleton-text subtitle shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;

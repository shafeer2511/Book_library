import React from 'react';
import { useProfileContext } from './ProfileContext';

const PersonalizedSettings = () => {
  const { user } = useProfileContext();
  return (
    <div className="content-section">
      <h3>Personalized Settings</h3>
      <p><strong>Favorite Genres:</strong> {user?.genres && user.genres.length > 0 ? user.genres.join(", ") : "None specified"}</p>
      <p><strong>Application Theme:</strong> Configurable via Navbar Switch</p>
      <p><strong>Email Notifications:</strong> Enabled</p>
    </div>
  );
};

export default PersonalizedSettings;

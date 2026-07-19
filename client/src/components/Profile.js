// components/Profile.js
import React, { useState } from 'react';
import './styles/Profile.css';
import { ProfileProvider } from './ProfileComponents/ProfileContext';
import ProfileSection from './ProfileComponents/ProfileSection';
import ReadingStats from './ProfileComponents/ReadingStats';
import ReviewsFavorites from './ProfileComponents/ReviewsFavorites';
import PersonalizedSettings from './ProfileComponents/PersonalizedSettings';
import AccountActions from './ProfileComponents/AccountActions';
import Collection from './Collections';
import EditProfileModal from './ProfileComponents/EditProfileModal';
import PasswordModal from './ProfileComponents/PasswordModal';
import DeleteAccountModal from './ProfileComponents/DeleteAccountModal';

const Profile = () => {
  const [activeSection, setActiveSection] = useState('profile');

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'stats':
        return <ReadingStats />;
      case 'reviews':
        return <ReviewsFavorites />;
      case 'collections':
        return <Collection />;
      case 'settings':
        return <PersonalizedSettings />;
      case 'actions':
        return <AccountActions />;
      default:
        return null;
    }
  };

  return (
    <ProfileProvider>
      <div className="profile-wrapper">
        <div className="profile-container">
          <aside className="profile-sidebar">
            <div className="sidebar-header">
              <span className="sidebar-title">My Account</span>
            </div>
            <nav className="sidebar-nav">
              <button 
                onClick={() => setActiveSection('profile')}
                className={activeSection === 'profile' ? 'active' : ''}
              >
                👤 Profile Info
              </button>
              <button 
                onClick={() => setActiveSection('stats')}
                className={activeSection === 'stats' ? 'active' : ''}
              >
                📊 Reading Stats
              </button>
              <button 
                onClick={() => setActiveSection('reviews')}
                className={activeSection === 'reviews' ? 'active' : ''}
              >
                ✍️ Reviews & Favorites
              </button>
              <button 
                onClick={() => setActiveSection('collections')}
                className={activeSection === 'collections' ? 'active' : ''}
              >
                📁 My Collections
              </button>
              <button 
                onClick={() => setActiveSection('settings')}
                className={activeSection === 'settings' ? 'active' : ''}
              >
                ⚙️ Settings
              </button>
              <button 
                onClick={() => setActiveSection('actions')}
                className={activeSection === 'actions' ? 'active' : ''}
              >
                🛡️ Account Actions
              </button>
            </nav>
          </aside>

          <main className="profile-main-content">
            {renderContent()}
          </main>

          {/* Render Modals */}
          <EditProfileModal />
          <PasswordModal />
          <DeleteAccountModal />
        </div>
      </div>
    </ProfileProvider>
  );
};

export default Profile;

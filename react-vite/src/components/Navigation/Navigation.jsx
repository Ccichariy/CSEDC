import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import CreateVideoModal from "../CreateVideoModal";
import "./Navigation.css";

function Navigation() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const user = useSelector(state => state.session.user);

  // Helper component for Add Video button
  const AddVideoButton = () => {
    if (!user) return null;
    
    return (
      <OpenModalButton
        modalComponent={<CreateVideoModal />}
        buttonText="+ Add Video"
        className="add-video-button"
      />
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="youtube-header">
      {/* Left section - Logo and menu */}
      <div className="header-left">
        <button className="menu-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        <NavLink to="/" className="logo-link">
          <div className="logo">
            <div className="logo-icon">
               <svg width="32" height="32" viewBox="0 0 100 100">
                 <defs>
                   <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" style={{stopColor: '#DC143C', stopOpacity: 1}} />
                     <stop offset="50%" style={{stopColor: '#B22222', stopOpacity: 1}} />
                     <stop offset="100%" style={{stopColor: '#8B0000', stopOpacity: 1}} />
                   </linearGradient>
                 </defs>
                 <rect x="10" y="10" width="80" height="80" rx="15" ry="15" fill="url(#logoGradient)" stroke="#8B0000" strokeWidth="2"/>
                 <text x="50" y="65" fontFamily="serif" fontSize="48" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">π</text>
               </svg>
             </div>
            <span className="logo-text">MathTube</span>
          </div>
        </NavLink>
      </div>

      {/* Center section - Search */}
      <div className="header-center">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Right section - User menu */}
      <div className="header-right">
        <AddVideoButton />
        <ProfileButton />
      </div>
    </header>
  );
}

export default Navigation;

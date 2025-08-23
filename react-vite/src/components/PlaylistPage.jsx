import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { thunkFetchPlaylistsWithVideos } from '../redux/playlists';
import placeholderThumbnail from '../assets/placeholder-thumbnail.svg';
import { useModal } from '../context/Modal';
import OpenModalButton from './OpenModalButton';
import CreatePlaylistModal from './CreatePlaylistModal/CreatePlaylistModal';
import EditPlaylistModal from './EditPlaylistModal/EditPlaylistModal';
import DeletePlaylistModal from './DeletePlaylistModal/DeletePlaylistModal';
import './Homepage.css'; // Reusing existing styles
import './PlaylistPage.css'; // Playlist-specific styles

export default function PlaylistPage() {
  const dispatch = useDispatch();
  const playlists = useSelector(state => Object.values(state.playlists.allPlaylists));
  const loading = useSelector(state => state.playlists.loading);
  const error = useSelector(state => state.playlists.error);
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(thunkFetchPlaylistsWithVideos());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="homepage-container">
        <div className="loading-message">Loading playlists...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="homepage-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Math Playlists</h1>
            <p>Organized collections of math videos by topic</p>
          </div>
          {user && (
            <div className="header-actions">
              <OpenModalButton
                buttonText="+ Create Playlist"
                modalComponent={<CreatePlaylistModal />}
                style={{
                  backgroundColor: '#0066cc',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              />
            </div>
          )}
        </div>
      </header>

      <main className="homepage-content">
        <section className="featured-section">
          <h2>Available Playlists ({playlists.length})</h2>
          
          {playlists.length === 0 ? (
            <div className="no-results">
              <p>No playlists available at the moment.</p>
            </div>
          ) : (
            <div className="playlists-grid">
              {playlists.map(playlist => (
                <div key={playlist.id} className="playlist-card">
                  <div className="playlist-header">
                    <div className="playlist-title-section">
                      <h3>{playlist.name}</h3>
                      {user && user.id === playlist.userId && (
                        <div className="playlist-actions">
                          <OpenModalButton
                            buttonText="Edit"
                            modalComponent={<EditPlaylistModal playlist={playlist} />}
                            style={{
                              backgroundColor: '#0066cc',
                              color: '#ffffff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              marginRight: '8px'
                            }}
                          />
                          <OpenModalButton
                            buttonText="Delete"
                            modalComponent={<DeletePlaylistModal playlist={playlist} />}
                            style={{
                              backgroundColor: '#cc4444',
                              color: '#ffffff',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {playlist.description && (
                      <p className="playlist-description">{playlist.description}</p>
                    )}
                    <div className="playlist-meta">
                      <span className="video-count">{playlist.videos?.length || 0} videos</span>
                    </div>
                  </div>
                  
                  {playlist.videos && playlist.videos.length > 0 && (
                    <div className="playlist-videos">
                      <h4>Videos in this playlist:</h4>
                      <div className="youtube-videos-grid">
                        {playlist.videos.slice(0, 4).map(video => (
                          <div key={video.id} className="youtube-video-card">
                            <div className="youtube-thumbnail-container">
                              <Link to={`/videos/${video.id}`}>
                                <img 
                                  src={video.thumbnailUrl || placeholderThumbnail} 
                                  alt={video.title}
                                  className="youtube-thumbnail"
                                  onError={(e) => {
                                    e.target.src = placeholderThumbnail;
                                  }}
                                />
                              </Link>
                            </div>
                            <div className="youtube-video-info">
                              <h3 className="youtube-video-title">
                                <Link to={`/videos/${video.id}`}>{video.title}</Link>
                              </h3>
                              <p className="youtube-video-description">{video.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {playlist.videos.length > 4 && (
                        <p className="more-videos">...and {playlist.videos.length - 4} more videos</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="browse-section">
          <h2>Browse Videos</h2>
          <Link to="/videos" className="browse-link">
            View All Videos →
          </Link>
        </section>
      </main>
    </div>
  );
}
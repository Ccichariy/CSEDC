import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import placeholderThumbnail from '../assets/placeholder-thumbnail.svg';
import './Homepage.css'; // Reusing existing styles
import './PlaylistPage.css'; // Playlist-specific styles

export default function PlaylistPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/playlists/with-videos`);
        if (response.ok) {
          const playlistData = await response.json();
          setPlaylists(playlistData);
        } else {
          setError('Failed to fetch playlists');
        }
      } catch (err) {
        setError('Error loading playlists');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

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
        <h1>Math Playlists</h1>
        <p>Organized collections of math videos by topic</p>
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
                    <h3>{playlist.name}</h3>
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
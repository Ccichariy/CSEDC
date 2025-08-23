
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { thunkFetchVideos, thunkSearchVideos, thunkFetchFilters } from '../redux/videos';
import placeholderThumbnail from '../assets/placeholder-thumbnail.svg';
import './Homepage.css';

export default function Homepage() {
  const dispatch = useDispatch();
  const { allVideos, loading } = useSelector(state => state.videos);
  const videos = Object.values(allVideos || {});
  const [selectedFilter, setSelectedFilter] = useState('');
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    dispatch(thunkFetchVideos());
    
    // Fetch filters
    const fetchFilters = async () => {
      const filterData = await dispatch(thunkFetchFilters());
      if (filterData) {
        setFilters(filterData);
      }
    };
    
    fetchFilters();
  }, [dispatch]);

  const handleFilterChange = async (filterId) => {
    setSelectedFilter(filterId);
    if (filterId === '') {
      dispatch(thunkFetchVideos());
    } else {
      await dispatch(thunkSearchVideos('', filterId));
    }
  };



  if (loading) return <div className="loading">Loading videos...</div>;

  return (
    <div className="homepage">
      {/* Video filters */}
      <div className="filter-bar">
        <div className="filter-chips">
          <button
            className={`filter-chip ${selectedFilter === '' ? 'active' : ''}`}
            onClick={() => handleFilterChange('')}
          >
            All
          </button>
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={`filter-chip ${selectedFilter === filter.id ? 'active' : ''}`}
              onClick={() => handleFilterChange(filter.id)}
            >
              {filter.name}
            </button>
          ))}
        </div>
        <Link to="/playlists" className="playlist-nav-button">
          Math Playlists
        </Link>
      </div>

      <main className="homepage-content">
        <section className="featured-section">
          <h2>Featured Videos</h2>
          
          {videos.length === 0 ? (
            <div className="no-results">
              <p>No featured videos available.</p>
            </div>
          ) : (
            <div className="youtube-videos-grid">
              {videos.map(video => (
                <div key={video.id} className="youtube-video-card">
                  <div className="youtube-thumbnail-container">
                    <Link to={`/videos/${video.id}`}>
                      <img 
                        src={video.thumbnail_url || placeholderThumbnail} 
                        alt={video.title}
                        className="youtube-thumbnail"
                        onError={(e) => {
                          e.target.src = placeholderThumbnail;
                        }}
                      />
                      <div className="video-duration">10:24</div>
                    </Link>
                  </div>
                  <div className="youtube-video-info">
                    <div className="video-avatar">
                      <div className="avatar-placeholder">
                        {video.user?.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div className="video-details">
                      <Link to={`/videos/${video.id}`} className="video-title">
                        {video.title}
                      </Link>
                      <div className="video-channel">
                        {video.user?.username || 'Unknown Channel'}
                      </div>
                      <div className="video-metadata">
                        <span>1.2K views</span>
                        <span>•</span>
                        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="browse-section">
          <h2>Browse All Videos</h2>
          <Link to="/videos" className="browse-link">
            View All Videos →
          </Link>
        </section>
        

      </main>
    </div>
  );
}
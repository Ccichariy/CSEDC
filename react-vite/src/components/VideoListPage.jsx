import { useEffect }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link }       from 'react-router-dom';
import { thunkFetchVideosWithComments } from '../redux/videos';

export default function VideoListPage() {
  const dispatch = useDispatch();
  const videos = useSelector(state => Object.values(state.videos.allVideos));
  const loading = useSelector(state => state.videos.loading);

  useEffect(() => {
    dispatch(thunkFetchVideosWithComments());
  }, [dispatch]);

  if (loading) return <div>Loading videos...</div>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f0f0f', color: '#ffffff', minHeight: '100vh' }}>
      <h2 style={{ color: '#ffffff', marginBottom: '20px' }}>All Videos with Comments</h2>
      {videos.length === 0 ? (
        <p style={{ color: '#aaaaaa' }}>No videos available.</p>
      ) : (
        <div style={{ display: 'grid', gap: '30px' }}>
          {videos.map(video => (
            <div key={video.id} style={{ 
              border: '1px solid #3f3f3f', 
              borderRadius: '8px', 
              padding: '20px',
              backgroundColor: '#1a1a1a'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <h3>
                  <Link 
                    to={`/videos/${video.id}`}
                    style={{ textDecoration: 'none', color: '#0066cc' }}
                  >
                    {video.title}
                  </Link>
                </h3>
                <p style={{ color: '#cccccc', margin: '5px 0' }}>{video.description}</p>
                <small style={{ color: '#aaaaaa' }}>
                  Created: {new Date(video.createdAt).toLocaleDateString()}
                </small>
              </div>
              
              <div>
                <h4 style={{ marginBottom: '10px' }}>
                  Comments ({video.comments ? video.comments.length : 0})
                </h4>
                {video.comments && video.comments.length > 0 ? (
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {video.comments.map(comment => (
                      <div key={comment.id} style={{
                        backgroundColor: '#2d2d2d',
                        padding: '10px',
                        margin: '5px 0',
                        borderRadius: '4px',
                        borderLeft: '3px solid #0066cc',
                        color: '#ffffff'
                      }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#ffffff' }}>
                          User {comment.userId}
                        </div>
                        <div style={{ margin: '5px 0', color: '#ffffff' }}>{comment.content}</div>
                        <small style={{ color: '#aaaaaa' }}>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#aaaaaa', fontStyle: 'italic' }}>No comments yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
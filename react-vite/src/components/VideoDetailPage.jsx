import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams }    from 'react-router-dom';
import {
  thunkFetchVideoDetail
} from '../redux/videos';
import { thunkGetComments, thunkAddComment, thunkUpdateComment, thunkDeleteComment } from '../redux/comments';
import { useModal } from '../context/Modal';
import OpenModalButton from './OpenModalButton';
import EditVideoModal from './EditVideoModal/EditVideoModal';
import DeleteVideoModal from './DeleteVideoModal/DeleteVideoModal';
import AddVideoToPlaylistModal from './AddVideoToPlaylistModal/AddVideoToPlaylistModal';
import './VideoDetailPage.css';

// Helper function to convert YouTube URL to embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  
  // Extract video ID from different YouTube URL formats
  let videoId = '';
  
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('watch?v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('youtube.com/embed/')) {
    // Already an embed URL
    return url;
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

export default function VideoDetailPage() {
  const { id }     = useParams();
  const dispatch  = useDispatch();
  const video     = useSelector(s => s.videos.currentVideo);
  const comments  = useSelector(s => s.comments.comments);
  const user      = useSelector(s => s.session.user);
  const [body, setBody] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    dispatch(thunkFetchVideoDetail(id));
    dispatch(thunkGetComments(id));
  }, [dispatch, id]);

  const handleSubmit = e => {
    e.preventDefault();
    if (body.trim()) {
      dispatch(thunkAddComment(id, body));
      setBody('');
    }
  };

  const handleEditComment = (commentId, currentContent) => {
    setEditingCommentId(commentId);
    setEditContent(currentContent);
  };

  const handleUpdateComment = (commentId) => {
    if (editContent.trim()) {
      dispatch(thunkUpdateComment(id, commentId, editContent));
      setEditingCommentId(null);
      setEditContent('');
    }
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(thunkDeleteComment(id, commentId));
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  if (!video.id) return <div>Loading…</div>;

  // Debug logging to check ownership
  console.log('Debug - User:', user);
  console.log('Debug - Video:', video);
  console.log('Debug - User ID:', user?.id);
  console.log('Debug - Video Owner ID:', video?.ownerId);
  console.log('Debug - Ownership check:', user && user.id === video.ownerId);

  return (
    <div className="video-detail-container">
      <div className="video-header">
        <h1 className="video-title">{video.title}</h1>
        <div className="video-meta">
          By User {video.ownerId} • {new Date(video.createdAt).toLocaleDateString()}
        </div>
      </div>
      
      <div className="video-embed-container">
        <iframe
          width="100%"
          height="400"
          src={getYouTubeEmbedUrl(video.url)}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      
      <p className="video-description">{video.description}</p>
      
      {/* Video Actions Section */}
      <div className="video-actions">
        {user && user.id === video.ownerId && (
          <>
            <OpenModalButton
              buttonText="Edit Video"
              modalComponent={<EditVideoModal video={video} />}
              className="video-action-btn edit-btn"
            />
            <OpenModalButton
              buttonText="Delete Video"
              modalComponent={<DeleteVideoModal video={video} />}
              className="video-action-btn delete-btn"
            />
          </>
        )}
        {user && (
          <OpenModalButton
            buttonText="Add to Playlist"
            modalComponent={<AddVideoToPlaylistModal video={video} />}
            className="video-action-btn add-to-playlist-btn"
          />
        )}
      </div>
      
      {/* Comments Section */}
      <div className="comments-section">
        <h3 className="comments-header">Comments ({comments.length})</h3>
        
        <ul className="comments-list">
          {comments.map(c => (
            <li key={c.id} className="comment-item">
              <div className="comment-header">
                <div>
                  <strong className="comment-author">{c.user?.username || `User ${c.userId}`}</strong>
                  {editingCommentId === c.id ? (
                    <div style={{ marginTop: '8px' }}>
                      <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        className="comment-textarea"
                      />
                      <div className="comment-actions">
                        <button
                          onClick={() => handleUpdateComment(c.id)}
                          className="comment-btn edit"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="comment-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="comment-content">{c.content}</div>
                  )}
                </div>
                {user && user.id === c.userId && editingCommentId !== c.id && (
                  <div className="comment-actions">
                    <button
                      onClick={() => handleEditComment(c.id, c.content)}
                      className="comment-btn edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="comment-btn delete"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
        
        {user ? (
          <form onSubmit={handleSubmit} className="comment-form">
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Add a comment"
              rows="3"
              className="comment-textarea"
            />
            <button type="submit" className="comment-submit-btn">
              Post Comment
            </button>
          </form>
        ) : (
          <div className="login-prompt">
            <p>Please log in to add a comment</p>
            <button 
              className="login-btn"
              onClick={() => window.location.href = '/login'}
            >
              Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
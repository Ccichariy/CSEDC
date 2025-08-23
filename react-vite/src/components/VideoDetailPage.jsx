import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams }    from 'react-router-dom';
import {
  thunkFetchVideoDetail
} from '../redux/videos';
import { thunkGetComments, thunkAddComment, thunkUpdateComment, thunkDeleteComment } from '../redux/comments';

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

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f0f0f', color: '#ffffff', minHeight: '100vh' }}>
      <h2 style={{ color: '#ffffff', marginBottom: '10px' }}>{video.title}</h2>
      <p style={{ color: '#cccccc', marginBottom: '20px' }}>{video.description}</p>
      <iframe 
        width="560" 
        height="315" 
        src={video.url.replace('watch?v=', 'embed/')} 
        title={video.title}
        frameBorder="0" 
        allowFullScreen
        style={{ marginBottom: '20px' }}
      ></iframe>
      <hr style={{ borderColor: '#3f3f3f', margin: '20px 0' }}/>
      <h3 style={{ color: '#ffffff', marginBottom: '15px' }}>Comments ({comments.length})</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {comments.map(c => (
          <li key={c.id} style={{
            backgroundColor: '#2d2d2d',
            padding: '12px',
            margin: '10px 0',
            borderRadius: '8px',
            borderLeft: '3px solid #0066cc'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <strong style={{ color: '#ffffff' }}>{c.user?.username || `User ${c.userId}`}:</strong>
                {editingCommentId === c.id ? (
                  <div style={{ marginTop: '8px' }}>
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#1a1a1a',
                        color: '#ffffff',
                        border: '1px solid #3f3f3f',
                        borderRadius: '4px',
                        padding: '8px',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        minHeight: '60px'
                      }}
                    />
                    <div style={{ marginTop: '8px' }}>
                      <button
                        onClick={() => handleUpdateComment(c.id)}
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
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        style={{
                          backgroundColor: '#666666',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <span style={{ color: '#ffffff', marginLeft: '8px', display: 'block', marginTop: '4px' }}>
                    {c.content}
                  </span>
                )}
                <small style={{ color: '#aaaaaa', display: 'block', marginTop: '5px' }}>
                  {new Date(c.createdAt).toLocaleDateString()}
                </small>
              </div>
              {user && user.id === c.userId && editingCommentId !== c.id && (
                <div style={{ marginLeft: '12px' }}>
                  <button
                    onClick={() => handleEditComment(c.id, c.content)}
                    style={{
                      backgroundColor: '#4a4a4a',
                      color: '#ffffff',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      marginRight: '4px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    style={{
                      backgroundColor: '#cc4444',
                      color: '#ffffff',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px'
                    }}
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
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Add a comment"
            rows="3"
            style={{ 
              width: '100%', 
              marginBottom: '10px',
              backgroundColor: '#2d2d2d',
              color: '#ffffff',
              border: '1px solid #3f3f3f',
              borderRadius: '4px',
              padding: '10px',
              fontFamily: 'inherit'
            }}
          />
          <button 
            type="submit"
            style={{
              backgroundColor: '#0066cc',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Post Comment
          </button>
        </form>
      ) : (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          backgroundColor: '#2d2d2d', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ color: '#aaaaaa', marginBottom: '15px' }}>
            Please log in to add a comment
          </p>
          <button 
            style={{
              backgroundColor: '#0066cc',
              color: '#ffffff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onClick={() => window.location.href = '/login'}
          >
            Log In
          </button>
        </div>
      )}
    </div>
  );
}
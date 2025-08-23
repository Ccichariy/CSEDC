import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams }    from 'react-router-dom';
import {
  thunkFetchVideoDetail
} from '../redux/videos';
import {thunkGetComments, loadCommentsForVideo} from '../redux/comments';

export default function VideoDetailPage() {
  const { id }     = useParams();
  const dispatch  = useDispatch();
  const video     = useSelector(s => s.videos.currentVideo);
  const comments  = useSelector(s => s.videos.comments);
  const [body, setBody] = useState('');
  const [thunkGetComments] = useSelector(s => s.comments.id);

  useEffect(() => {
    dispatch(thunkFetchVideoDetail(id));
  }, [dispatch, id]);

  const handleSubmit = e => {
    e.preventDefault();
    dispatch(thunkGetComments(id, body));
    setBody('');
  };

  if (!video.id) return <div>Loading…</div>;

  return (
    <div>
      <h2>{video.title}</h2>
      <p>{video.description}</p>
      <hr/>
      <h3>Comments</h3>
      <ul>
        {comments.map(c => <li key={c.id}>{c.content}</li>)}
      </ul>
      <form onSubmit={handleSubmit}>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Post Comment</button>
      </form>
    </div>
  );
}
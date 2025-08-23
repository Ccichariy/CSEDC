import { useEffect }  from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link }       from 'react-router-dom';
import { thunkFetchVideos } from '../redux/videos';

export default function VideoListPage() {
  const dispatch = useDispatch();
  const videos = useSelector(state => Object.values(state.videos.allVideos));

  useEffect(() => {
    dispatch(thunkFetchVideos());
  }, [dispatch]);

  return (
    <div>
      <h2>All Videos</h2>
      <ul>
        {videos.map(v => (
          <li key={v.id}>
            <Link to={`/videos/${v.id}`}>{v.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
import { createBrowserRouter } from 'react-router-dom';
import Layout            from './Layout';
import Homepage          from '../components/Homepage';
import VideoListPage     from '../components/VideoListPage';
import VideoDetailPage   from '../components/VideoDetailPage';
import LoginFormPage     from '../components/LoginFormPage';
import SignupFormPage    from '../components/SignupFormPage';
import PlaylistPage      from '../components/PlaylistPage';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index:  true,                element: <Homepage />        },
      { path:   "login",             element: <LoginFormPage />   },
      { path:   "signup",            element: <SignupFormPage />  },
      { path:   "videos",            element: <VideoListPage />   },
      { path:   "videos/:id",        element: <VideoDetailPage /> },
      { path:   "playlists",         element: <PlaylistPage />    },
    ]
  }
]);
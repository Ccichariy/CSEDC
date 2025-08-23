import { createBrowserRouter } from 'react-router-dom';
import Layout            from './Layout';
import HomePage          from '../components/HomePage';
import VideoListPage     from '../components/VideoListPage';
import VideoDetailPage   from '../components/VideoDetailPage';
import LoginFormPage     from '../components/LoginFormPage';
import SignupFormPage    from '../components/SignupFormPage';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index:  true,                element: <HomePage />        },
      { path:   "login",             element: <LoginFormPage />   },
      { path:   "signup",            element: <SignupFormPage />  },
      { path:   "videos",            element: <VideoListPage />   },
      { path:   "videos/:id",        element: <VideoDetailPage /> },
    ]
  }
]);
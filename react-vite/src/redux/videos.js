// action types
const LOAD_VIDEOS        = 'videos/loadVideos';
const LOAD_VIDEO_DETAIL  = 'videos/loadVideoDetail';
const ADD_VIDEO          = 'videos/addVideo';
const UPDATE_VIDEO       = 'videos/updateVideo';
const DELETE_VIDEO       = 'videos/deleteVideo';
const SET_LOADING        = 'videos/setLoading';

// action creators
const setLoading = (loading) => ({ type: SET_LOADING, payload: loading });
const loadVideos = (videos) => ({ type: LOAD_VIDEOS, payload: videos });
const loadVideoDetail = (video) => ({ type: LOAD_VIDEO_DETAIL, payload: video });
const addVideo = (video) => ({ type: ADD_VIDEO, payload: video });
const updateVideo = (video) => ({ type: UPDATE_VIDEO, payload: video });
const deleteVideo = (videoId) => ({ type: DELETE_VIDEO, payload: videoId });

// thunks
export const thunkFetchVideos = () => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/videos`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadVideos(data));
  }
  dispatch(setLoading(false));
};

export const thunkFetchVideoDetail = (id) => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/videos/${id}`);
  if (res.ok) {
    const video = await res.json();
    dispatch(loadVideoDetail(video));
  }
  dispatch(setLoading(false));
};

export const thunkAddVideo = (videoData) => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/videos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(videoData)
  });
  if (res.ok) {
    const video = await res.json();
    dispatch(addVideo(video));
  }
  dispatch(setLoading(false));
};

export const thunkUpdateVideo = (videoId, videoData) => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/videos/${videoId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(videoData)
  });
  if (res.ok) {
    const video = await res.json();
    dispatch(updateVideo(video));
  }
  dispatch(setLoading(false));
};

export const thunkDeleteVideo = (videoId) => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/videos/${videoId}`, {
    method: 'DELETE'
  });
  if (res.ok) {
    dispatch(deleteVideo(videoId));
  }
  dispatch(setLoading(false));
};

// reducer
const initialState = {
  allVideos:    {},  // { [id]: video }
  currentVideo: {},
  loading:      false
};

export default function videosReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case LOAD_VIDEOS: {
      const byId = {};
      action.payload.forEach(v => byId[v.id] = v);
      return { ...state, allVideos: byId };
    }
    case ADD_VIDEO:
      return { ...state, allVideos: { ...state.allVideos, [action.payload.id]: action.payload } };
    case UPDATE_VIDEO:
      return { ...state, allVideos: { ...state.allVideos, [action.payload.id]: action.payload } };
    case DELETE_VIDEO: {
      const newVideos = { ...state.allVideos };
      delete newVideos[action.payload];
      return { ...state, allVideos: newVideos };
    }
    case LOAD_VIDEO_DETAIL:
      return { ...state, currentVideo: action.payload };
    default:
      return state;
  }
}
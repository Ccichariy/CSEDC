// action types
const LOAD_PLAYLISTS = 'playlists/loadPlaylists';
const ADD_PLAYLIST = 'playlists/addPlaylist';
const UPDATE_PLAYLIST = 'playlists/updatePlaylist';
const DELETE_PLAYLIST = 'playlists/deletePlaylist';
const SET_LOADING = 'playlists/setLoading';

// action creators
const setLoading = (loading) => ({ type: SET_LOADING, payload: loading });
const loadPlaylists = (playlists) => ({ type: LOAD_PLAYLISTS, payload: playlists });
const addPlaylist = (playlist) => ({ type: ADD_PLAYLIST, payload: playlist });
const updatePlaylist = (playlist) => ({ type: UPDATE_PLAYLIST, payload: playlist });
const deletePlaylist = (playlistId) => ({ type: DELETE_PLAYLIST, payload: playlistId });

// thunks
export const thunkFetchPlaylists = () => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/playlists`);
  if (res.ok) {
    const playlists = await res.json();
    dispatch(loadPlaylists(playlists));
  }
  dispatch(setLoading(false));
};

export const thunkFetchPlaylistsWithVideos = () => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/playlists/with-videos`);
  if (res.ok) {
    const playlists = await res.json();
    dispatch(loadPlaylists(playlists));
  }
  dispatch(setLoading(false));
};

export const thunkAddPlaylist = (playlistData) => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/playlists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(playlistData)
  });
  if (res.ok) {
    const playlist = await res.json();
    dispatch(addPlaylist(playlist));
    return playlist;
  }
  dispatch(setLoading(false));
  return null;
};

export const thunkUpdatePlaylist = (playlistId, playlistData) => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/playlists/${playlistId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(playlistData)
  });
  if (res.ok) {
    const playlist = await res.json();
    dispatch(updatePlaylist(playlist));
    return playlist;
  }
  dispatch(setLoading(false));
  return null;
};

export const thunkDeletePlaylist = (playlistId) => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/playlists/${playlistId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (res.ok) {
    dispatch(deletePlaylist(playlistId));
    return true;
  }
  dispatch(setLoading(false));
  return false;
};

// reducer
const initialState = {
  allPlaylists: {},
  loading: false
};

export default function playlistsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case LOAD_PLAYLISTS:
      const playlistsObj = {};
      action.payload.forEach(playlist => {
        playlistsObj[playlist.id] = playlist;
      });
      return { ...state, allPlaylists: playlistsObj };
    case ADD_PLAYLIST:
      return {
        ...state,
        allPlaylists: {
          ...state.allPlaylists,
          [action.payload.id]: action.payload
        }
      };
    case UPDATE_PLAYLIST:
      return {
        ...state,
        allPlaylists: {
          ...state.allPlaylists,
          [action.payload.id]: action.payload
        }
      };
    case DELETE_PLAYLIST:
      const newPlaylists = { ...state.allPlaylists };
      delete newPlaylists[action.payload];
      return { ...state, allPlaylists: newPlaylists };
    default:
      return state;
  }
}
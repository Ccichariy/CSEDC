// action types
const LOAD_COMMENTS    = 'comments/loadComments';
const ADD_COMMENT      = 'comments/addComment';
const UPDATE_COMMENT   = 'comments/updateComment';
const DELETE_COMMENT   = 'comments/deleteComment';
const SET_LOADING      = 'comments/setLoading';
const LOAD_COMMENTS_FOR_VIDEO = 'comments/loadCommentsForVideo';

// action creators
const setLoading = (loading) => ({ type: SET_LOADING, payload: loading });
const loadComments = (comments) => ({ type: LOAD_COMMENTS, payload: comments });
const addComment = (comment) => ({ type: ADD_COMMENT, payload: comment });
const updateComment = (comment) => ({ type: UPDATE_COMMENT, payload: comment });
const deleteComment = (commentId) => ({ type: DELETE_COMMENT, payload: commentId });
const loadCommentsForVideo = (videoId, comments) => ({
  type: LOAD_COMMENTS_FOR_VIDEO,
  payload: { videoId, comments }
});

// thunks
export const thunkFetchComments = (videoId) => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/${videoId}/comments`);
  if (res.ok) {
    const data = await res.json();
    dispatch(loadComments(data));
  }
  dispatch(setLoading(false));
};

export const thunkAddComment = (videoId, content) => async (dispatch, getState) => {
  dispatch(setLoading(true));
  const { session } = getState();
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/${videoId}/comments`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ 
      content,
      userId: session.user?.id
    })
  });
  if (res.ok) {
    const comment = await res.json();
    dispatch(addComment(comment));
  }
  dispatch(setLoading(false));
};

export const thunkGetComments = (videoId) => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/${videoId}/comments`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });
  if (res.ok) {
    const comments = await res.json();
    dispatch(loadComments(comments));
  }
  dispatch(setLoading(false));
};

export const thunkUpdateComment = (videoId, commentId, content) => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/${videoId}/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content })
  });
  if (res.ok) {
    const comment = await res.json();
    dispatch(updateComment(comment));
  }
  dispatch(setLoading(false));
};

export const thunkDeleteComment = (videoId, commentId) => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/videos/${videoId}/comments/${commentId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (res.ok) {
    dispatch(deleteComment(commentId));
  }
  dispatch(setLoading(false));
};

// reducer
const initialState = {
  comments: [],
  loading: false
};

export { loadCommentsForVideo };

export default function commentsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case LOAD_COMMENTS:
      return { ...state, comments: action.payload };
    case ADD_COMMENT:
      return { ...state, comments: [...state.comments, action.payload] };
    case UPDATE_COMMENT:
      return {
        ...state,
        comments: state.comments.map(c =>
          c.id === action.payload.id ? action.payload : c
        )
      };
    case DELETE_COMMENT:
      return {
        ...state,
        comments: state.comments.filter(c => c.id !== action.payload)
      };
    case LOAD_COMMENTS_FOR_VIDEO:
      return {
        ...state,
        comments: action.payload.comments
      };
    default:
      return state;
  }
}
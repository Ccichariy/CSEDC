import Cookies from 'js-cookie';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER
});

export const thunkAuthenticate = () => async (dispatch) => {
    const API = import.meta.env.VITE_API_URL || '';
    const response = await fetch(`${API}/api/auth/`, {
        headers: {
            "XSRF-Token": Cookies.get("XSRF-TOKEN")
        },
        credentials: 'include'
    });
    if (response.ok) {
        const data = await response.json();
        if (data.errors) {
            return;
        }

        dispatch(setUser(data));
    }
};

export const thunkLogin = ({ credential, password }) => async dispatch => {
  const API = import.meta.env.VITE_API_URL || '';
  const response = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "XSRF-Token": Cookies.get("XSRF-TOKEN")
    },
    body: JSON.stringify({ credential, password }),
    credentials: 'include'
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    return null; // Explicitly return null on success
  } else if (response.status < 500) {
    let errorMessages;
    try {
      errorMessages = await response.json();
    } catch {
      errorMessages = { server: "Invalid response from server" };
    }
    return errorMessages;
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkSignup = ({ email, username, password }) => async (dispatch) => {
  const API = import.meta.env.VITE_API_URL || '';
  const response = await fetch(`${API}/api/auth/signup`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "XSRF-Token": Cookies.get("XSRF-TOKEN")
    },
    body: JSON.stringify({ email, username, password }),
    credentials: 'include'
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages;
  } else {
    return { server: "Something went wrong. Please try again" };
  }
};

export const thunkDemoLogin = () => async dispatch => {
  const API = import.meta.env.VITE_API_URL || '';
  const response = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "XSRF-Token": Cookies.get("XSRF-TOKEN")
    },
    body: JSON.stringify({
      credential: "Demo-lition", // or your demo username/email
      password: "password"       // or your demo password
    }),
    credentials: 'include'
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    return null;
  } else if (response.status < 500) {
    let errorMessages;
    try {
      errorMessages = await response.json();
    } catch {
      errorMessages = { server: "Invalid response from server" };
    }
    return errorMessages;
  } else {
    return { server: "Something went wrong. Please try again" };
  }
};

export const thunkLogout = () => async (dispatch) => {
  const API = import.meta.env.VITE_API_URL || '';
  await fetch(`${API}/api/auth/logout`, {
    headers: {
      "XSRF-Token": Cookies.get("XSRF-TOKEN")
    },
    credentials: 'include'
  });
  dispatch(removeUser());
};

const initialState = { user: null };

function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}

export default sessionReducer;
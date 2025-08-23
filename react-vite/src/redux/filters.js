// action types
const LOAD_FILTERS = 'filters/loadFilters';
const ADD_FILTER = 'filters/addFilter';
const UPDATE_FILTER = 'filters/updateFilter';
const DELETE_FILTER = 'filters/deleteFilter';
const SET_LOADING = 'filters/setLoading';

// action creators
const setLoading = (loading) => ({ type: SET_LOADING, payload: loading });
const loadFilters = (filters) => ({ type: LOAD_FILTERS, payload: filters });
const addFilter = (filter) => ({ type: ADD_FILTER, payload: filter });
const updateFilter = (filter) => ({ type: UPDATE_FILTER, payload: filter });
const deleteFilter = (filterId) => ({ type: DELETE_FILTER, payload: filterId });

// thunks
export const thunkFetchFilters = () => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/filters`);
  if (res.ok) {
    const filters = await res.json();
    dispatch(loadFilters(filters));
    return filters;
  }
  dispatch(setLoading(false));
  return null;
};

export const thunkAddFilter = (filterData) => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/filters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(filterData)
  });
  if (res.ok) {
    const filter = await res.json();
    dispatch(addFilter(filter));
    return filter;
  }
  dispatch(setLoading(false));
  return null;
};

export const thunkUpdateFilter = (filterId, filterData) => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/filters/${filterId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(filterData)
  });
  if (res.ok) {
    const filter = await res.json();
    dispatch(updateFilter(filter));
    return filter;
  }
  dispatch(setLoading(false));
  return null;
};

export const thunkDeleteFilter = (filterId) => async (dispatch) => {
  dispatch(setLoading(true));
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/filters/${filterId}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (res.ok) {
    dispatch(deleteFilter(filterId));
    return true;
  }
  dispatch(setLoading(false));
  return false;
};

// reducer
const initialState = {
  allFilters: {},
  loading: false
};

export default function filtersReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case LOAD_FILTERS:
      const filtersObj = {};
      action.payload.forEach(filter => {
        filtersObj[filter.id] = filter;
      });
      return { ...state, allFilters: filtersObj };
    case ADD_FILTER:
      return {
        ...state,
        allFilters: {
          ...state.allFilters,
          [action.payload.id]: action.payload
        }
      };
    case UPDATE_FILTER:
      return {
        ...state,
        allFilters: {
          ...state.allFilters,
          [action.payload.id]: action.payload
        }
      };
    case DELETE_FILTER:
      const newFilters = { ...state.allFilters };
      delete newFilters[action.payload];
      return { ...state, allFilters: newFilters };
    default:
      return state;
  }
}
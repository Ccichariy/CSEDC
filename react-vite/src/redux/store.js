import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import videosReducer from "./videos";   
import commentsReducer from "./comments";
import playlistsReducer from "./playlists";
import filtersReducer from "./filters";

const rootReducer = combineReducers({
  session: sessionReducer,
  videos:  videosReducer,
  comments: commentsReducer,
  playlists: playlistsReducer,
  filters: filtersReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;

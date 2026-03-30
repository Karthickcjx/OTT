import { createContext, useContext, useReducer, useCallback } from 'react';

const AppContext = createContext(null);

const initialState = {
  user: null,
  watchlist: [],
  recentlyWatched: [],
  selectedMovie: null,
  searchQuery: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'ADD_TO_WATCHLIST': {
      const exists = state.watchlist.some((m) => m.id === action.payload.id);
      if (exists) return state;
      return { ...state, watchlist: [action.payload, ...state.watchlist] };
    }
    case 'REMOVE_FROM_WATCHLIST':
      return {
        ...state,
        watchlist: state.watchlist.filter((m) => m.id !== action.payload),
      };
    case 'ADD_RECENTLY_WATCHED': {
      const filtered = state.recentlyWatched.filter((m) => m.id !== action.payload.id);
      return {
        ...state,
        recentlyWatched: [action.payload, ...filtered].slice(0, 20),
      };
    }
    case 'SET_SELECTED_MOVIE':
      return { ...state, selectedMovie: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = useCallback((userData) => {
    dispatch({ type: 'SET_USER', payload: userData });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const addToWatchlist = useCallback((movie) => {
    dispatch({ type: 'ADD_TO_WATCHLIST', payload: movie });
  }, []);

  const removeFromWatchlist = useCallback((id) => {
    dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: id });
  }, []);

  const isInWatchlist = useCallback(
    (id) => state.watchlist.some((m) => m.id === id),
    [state.watchlist]
  );

  const isAdmin = state.user?.role === 'admin';

  const addRecentlyWatched = useCallback((movie) => {
    dispatch({ type: 'ADD_RECENTLY_WATCHED', payload: movie });
  }, []);

  const setSelectedMovie = useCallback((movie) => {
    dispatch({ type: 'SET_SELECTED_MOVIE', payload: movie });
  }, []);

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        isAdmin,
        addRecentlyWatched,
        setSelectedMovie,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

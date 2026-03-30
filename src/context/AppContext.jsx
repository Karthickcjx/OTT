import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { getProfileAvatar } from '../utils/streamArtwork';

const AppContext = createContext(null);
const STORAGE_KEY = 'streamvault-app-state';

function createProfile(name, type = 'adult', id = crypto.randomUUID()) {
  return {
    id,
    name,
    avatar: getProfileAvatar({ id, name, type }),
    type,
  };
}

function buildDefaultProfiles(userName = 'Viewer') {
  return [
    createProfile(userName, 'adult', 'profile-adult'),
    createProfile('Kids Zone', 'kids', 'profile-kids'),
  ];
}

const initialState = {
  user: null,
  watchlist: [],
  recentlyWatched: [],
  selectedMovie: null,
  searchQuery: '',
  recentSearches: [],
  profiles: buildDefaultProfiles(),
  activeProfileId: 'profile-adult',
  settings: {
    theme: 'dark',
    language: 'English',
    autoplay: true,
    quality: 'Auto',
  },
};

function loadState() {
  if (typeof window === 'undefined') return initialState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;

    const parsed = JSON.parse(raw);
    const userName = parsed.user?.name || initialState.user?.name || 'Viewer';
    const profiles = Array.isArray(parsed.profiles) && parsed.profiles.length > 0
      ? parsed.profiles.map((profile) => ({
          ...profile,
          avatar: profile.avatar || getProfileAvatar(profile),
        }))
      : buildDefaultProfiles(userName);

    const activeProfileId = profiles.some((profile) => profile.id === parsed.activeProfileId)
      ? parsed.activeProfileId
      : profiles[0].id;

    return {
      ...initialState,
      ...parsed,
      profiles,
      activeProfileId,
      settings: {
        ...initialState.settings,
        ...(parsed.settings || {}),
      },
      recentSearches: parsed.recentSearches || [],
      watchlist: parsed.watchlist || [],
      recentlyWatched: parsed.recentlyWatched || [],
    };
  } catch {
    return initialState;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER': {
      const nextUser = action.payload;
      const hasAdultProfile = state.profiles.some((profile) => profile.type === 'adult');
      const nextProfiles = hasAdultProfile
        ? state.profiles.map((profile, index) => {
            if (profile.type !== 'adult' || index !== state.profiles.findIndex((entry) => entry.type === 'adult')) {
              return profile;
            }

            const updated = { ...profile, name: nextUser.name };
            return { ...updated, avatar: getProfileAvatar(updated) };
          })
        : buildDefaultProfiles(nextUser.name);

      const nextAdultProfile = nextProfiles.find((profile) => profile.type === 'adult') || nextProfiles[0];

      return {
        ...state,
        user: nextUser,
        profiles: nextProfiles,
        activeProfileId: nextAdultProfile.id,
      };
    }

    case 'LOGOUT':
      return { ...state, user: null };

    case 'ADD_TO_WATCHLIST': {
      const exists = state.watchlist.some((movie) => movie.id === action.payload.id);
      if (exists) return state;
      return { ...state, watchlist: [action.payload, ...state.watchlist] };
    }

    case 'REMOVE_FROM_WATCHLIST':
      return {
        ...state,
        watchlist: state.watchlist.filter((movie) => movie.id !== action.payload),
      };

    case 'ADD_RECENTLY_WATCHED': {
      const filtered = state.recentlyWatched.filter((movie) => movie.id !== action.payload.id);
      return {
        ...state,
        recentlyWatched: [action.payload, ...filtered].slice(0, 20),
      };
    }

    case 'SET_SELECTED_MOVIE':
      return { ...state, selectedMovie: action.payload };

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'ADD_RECENT_SEARCH': {
      const term = action.payload.trim();
      if (!term) return state;
      const filtered = state.recentSearches.filter((entry) => entry.toLowerCase() !== term.toLowerCase());
      return {
        ...state,
        recentSearches: [term, ...filtered].slice(0, 6),
      };
    }

    case 'CLEAR_RECENT_SEARCHES':
      return { ...state, recentSearches: [] };

    case 'SWITCH_PROFILE':
      return { ...state, activeProfileId: action.payload };

    case 'ADD_PROFILE': {
      const profile = createProfile(action.payload.name, action.payload.type);
      return {
        ...state,
        profiles: [...state.profiles, profile],
      };
    }

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, loadState);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        watchlist: state.watchlist,
        recentlyWatched: state.recentlyWatched,
        searchQuery: state.searchQuery,
        recentSearches: state.recentSearches,
        profiles: state.profiles,
        activeProfileId: state.activeProfileId,
        settings: state.settings,
      }),
    );
  }, [
    state.activeProfileId,
    state.profiles,
    state.recentSearches,
    state.recentlyWatched,
    state.searchQuery,
    state.settings,
    state.user,
    state.watchlist,
  ]);

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
    (id) => state.watchlist.some((movie) => movie.id === id),
    [state.watchlist],
  );

  const addRecentlyWatched = useCallback((movie) => {
    dispatch({ type: 'ADD_RECENTLY_WATCHED', payload: movie });
  }, []);

  const setSelectedMovie = useCallback((movie) => {
    dispatch({ type: 'SET_SELECTED_MOVIE', payload: movie });
  }, []);

  const setSearchQuery = useCallback((query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const addRecentSearch = useCallback((query) => {
    dispatch({ type: 'ADD_RECENT_SEARCH', payload: query });
  }, []);

  const clearRecentSearches = useCallback(() => {
    dispatch({ type: 'CLEAR_RECENT_SEARCHES' });
  }, []);

  const switchProfile = useCallback((profileId) => {
    dispatch({ type: 'SWITCH_PROFILE', payload: profileId });
  }, []);

  const addProfile = useCallback((profile) => {
    dispatch({ type: 'ADD_PROFILE', payload: profile });
  }, []);

  const updateSettings = useCallback((settingsPatch) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settingsPatch });
  }, []);

  const activeProfile = state.profiles.find((profile) => profile.id === state.activeProfileId) || state.profiles[0];
  const isKidsMode = activeProfile?.type === 'kids';
  const isAdmin = state.user?.role === 'admin';

  return (
    <AppContext.Provider
      value={{
        ...state,
        activeProfile,
        isKidsMode,
        isAdmin,
        login,
        logout,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        addRecentlyWatched,
        setSelectedMovie,
        setSearchQuery,
        addRecentSearch,
        clearRecentSearches,
        switchProfile,
        addProfile,
        updateSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

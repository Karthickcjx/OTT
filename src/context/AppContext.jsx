import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { getProfileAvatar } from '../utils/streamArtwork';
import {
  loadPersistedAuth,
  persistAuth,
  clearAuth,
  getCurrentUser,
} from '../services/authService';
import {
  fetchWatchlist as apiFetchWatchlist,
  addToWatchlist as apiAddToWatchlist,
  removeFromWatchlist as apiRemoveFromWatchlist,
} from '../services/watchlistService';

const AppContext = createContext(null);
const STORAGE_KEY = 'streamvault-app-state';

/* ─── Profile helpers ─────────────────────────────────────────── */

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

/* ─── Initial state ───────────────────────────────────────────── */

const initialState = {
  user: null,
  token: null,
  authLoading: true, // true until we verify persisted JWT on boot
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

/* ─── Load local state ────────────────────────────────────────── */

function loadState() {
  if (typeof window === 'undefined') return initialState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check for persisted JWT auth
      const persisted = loadPersistedAuth();
      if (persisted) {
        return {
          ...initialState,
          user: persisted.user,
          token: persisted.token,
          authLoading: true, // will be verified in useEffect
        };
      }
      return initialState;
    }

    const parsed = JSON.parse(raw);

    // Restore JWT from dedicated storage
    const persisted = loadPersistedAuth();
    const user = persisted?.user || parsed.user || null;
    const token = persisted?.token || null;

    const userName = user?.name || 'Viewer';
    const profiles =
      Array.isArray(parsed.profiles) && parsed.profiles.length > 0
        ? parsed.profiles.map((profile) => ({
            ...profile,
            avatar: profile.avatar || getProfileAvatar(profile),
          }))
        : buildDefaultProfiles(userName);

    const activeProfileId = profiles.some(
      (profile) => profile.id === parsed.activeProfileId,
    )
      ? parsed.activeProfileId
      : profiles[0].id;

    return {
      ...initialState,
      ...parsed,
      user,
      token,
      authLoading: Boolean(token), // verify token on boot if present
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

/* ─── Reducer ─────────────────────────────────────────────────── */

function reducer(state, action) {
  switch (action.type) {
    case 'SET_AUTH': {
      const { user, token } = action.payload;
      const hasAdultProfile = state.profiles.some(
        (profile) => profile.type === 'adult',
      );
      const nextProfiles = hasAdultProfile
        ? state.profiles.map((profile, index) => {
            if (
              profile.type !== 'adult' ||
              index !==
                state.profiles.findIndex((entry) => entry.type === 'adult')
            ) {
              return profile;
            }

            const updated = { ...profile, name: user.name };
            return { ...updated, avatar: getProfileAvatar(updated) };
          })
        : buildDefaultProfiles(user.name);

      const nextAdultProfile =
        nextProfiles.find((profile) => profile.type === 'adult') ||
        nextProfiles[0];

      return {
        ...state,
        user,
        token,
        authLoading: false,
        profiles: nextProfiles,
        activeProfileId: nextAdultProfile.id,
      };
    }

    case 'SET_AUTH_LOADING':
      return { ...state, authLoading: action.payload };

    case 'LOGOUT': {
      const defaultProfiles = buildDefaultProfiles();
      return {
        ...state,
        user: null,
        token: null,
        authLoading: false,
        watchlist: [],
        recentlyWatched: [],
        profiles: defaultProfiles,
        activeProfileId: defaultProfiles[0].id,
      };
    }

    case 'SET_WATCHLIST':
      return { ...state, watchlist: action.payload };

    case 'ADD_TO_WATCHLIST': {
      const exists = state.watchlist.some(
        (item) =>
          item.id === action.payload.id ||
          item.contentId === action.payload.contentId,
      );
      if (exists) return state;
      return { ...state, watchlist: [action.payload, ...state.watchlist] };
    }

    case 'REMOVE_FROM_WATCHLIST':
      return {
        ...state,
        watchlist: state.watchlist.filter(
          (item) =>
            item.id !== action.payload &&
            item.contentId !== action.payload,
        ),
      };

    case 'ADD_RECENTLY_WATCHED': {
      const filtered = state.recentlyWatched.filter(
        (movie) => movie.id !== action.payload.id,
      );
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
      const filtered = state.recentSearches.filter(
        (entry) => entry.toLowerCase() !== term.toLowerCase(),
      );
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

/* ─── Provider ────────────────────────────────────────────────── */

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, loadState);
  const bootVerified = useRef(false);

  /* Verify persisted JWT on app boot */
  useEffect(() => {
    if (bootVerified.current) return;
    bootVerified.current = true;

    if (!state.token) {
      dispatch({ type: 'SET_AUTH_LOADING', payload: false });
      return;
    }

    getCurrentUser()
      .then((user) => {
        dispatch({
          type: 'SET_AUTH',
          payload: { user, token: state.token },
        });
      })
      .catch(() => {
        clearAuth();
        dispatch({ type: 'LOGOUT' });
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Sync watchlist from backend when user is authenticated */
  useEffect(() => {
    if (!state.user || !state.token) return;

    apiFetchWatchlist()
      .then((items) => {
        dispatch({ type: 'SET_WATCHLIST', payload: items });
      })
      .catch(() => {
        // Silently fail — watchlist stays local
      });
  }, [state.user, state.token]);

  /* Persist non-auth state to localStorage */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
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
  ]);

  /* ─── Auth actions ────────────────────────────────────────── */

  const login = useCallback((userData, token) => {
    persistAuth(token, userData);
    dispatch({ type: 'SET_AUTH', payload: { user: userData, token } });
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    dispatch({ type: 'LOGOUT' });
  }, []);

  /* ─── Watchlist actions (backend-synced) ───────────────────── */

  const addToWatchlist = useCallback(
    async (content) => {
      // Optimistic local update
      dispatch({ type: 'ADD_TO_WATCHLIST', payload: content });

      if (state.token) {
        try {
          await apiAddToWatchlist(
            content.id,
            content.type || 'movie',
          );
        } catch {
          // Revert on failure
          dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: content.id });
        }
      }
    },
    [state.token],
  );

  const removeFromWatchlist = useCallback(
    async (id) => {
      dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: id });

      if (state.token) {
        try {
          await apiRemoveFromWatchlist(id);
        } catch {
          // Silently fail — item already removed from UI
        }
      }
    },
    [state.token],
  );

  const isInWatchlist = useCallback(
    (id) =>
      state.watchlist.some(
        (item) => item.id === id || item.contentId === id,
      ),
    [state.watchlist],
  );

  /* ─── Other actions ───────────────────────────────────────── */

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

  /* ─── Derived values ──────────────────────────────────────── */

  const activeProfile =
    state.profiles.find(
      (profile) => profile.id === state.activeProfileId,
    ) || state.profiles[0];
  const isKidsMode = activeProfile?.type === 'kids';
  const isAdmin = state.user?.role === 'ADMIN' || state.user?.role === 'admin';
  const isAuthenticated = Boolean(state.user && state.token);

  return (
    <AppContext.Provider
      value={{
        ...state,
        activeProfile,
        isKidsMode,
        isAdmin,
        isAuthenticated,
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

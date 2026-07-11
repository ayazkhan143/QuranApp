import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from 'react';

type ReaderTheme = 'dark' | 'light';

type ReaderState = {
  lastPage: number;
  bookmarks: number[];
  showTranslation: boolean;
  arabicFontSize: number;
  theme: ReaderTheme;
};

type ReaderContextValue = ReaderState & {
  hydrated: boolean;
  setLastPage: (page: number) => void;
  toggleBookmark: (page: number) => void;
  toggleTranslation: () => void;
  setArabicFontSize: (size: number) => void;
  setTheme: (theme: ReaderTheme) => void;
};

const STORAGE_KEY = 'quran-app-reader-state-v1';
const defaultState: ReaderState = {
  lastPage: 1,
  bookmarks: [],
  showTranslation: true,
  arabicFontSize: 32,
  theme: 'dark',
};

const ReaderContext = createContext<ReaderContextValue | null>(null);

export function ReaderProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function hydrate() {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<ReaderState>;
        setState((current) => ({ ...current, ...parsed }));
      }
      setHydrated(true);
    }

    hydrate().catch(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => undefined);
    }
  }, [hydrated, state]);

  function updateState(next: Partial<ReaderState>) {
    setState((current) => ({ ...current, ...next }));
  }

  return (
    <ReaderContext.Provider
      value={{
        ...state,
        hydrated,
        setLastPage: (lastPage) => updateState({ lastPage }),
        toggleBookmark: (page) =>
          setState((current) => ({
            ...current,
            bookmarks: current.bookmarks.includes(page)
              ? current.bookmarks.filter((bookmark) => bookmark !== page)
              : [...current.bookmarks, page].sort((left, right) => left - right),
          })),
        toggleTranslation: () =>
          setState((current) => ({ ...current, showTranslation: !current.showTranslation })),
        setArabicFontSize: (arabicFontSize) =>
          updateState({ arabicFontSize: Math.min(Math.max(arabicFontSize, 24), 44) }),
        setTheme: (theme) => updateState({ theme }),
      }}>
      {children}
    </ReaderContext.Provider>
  );
}

export function useReader() {
  const context = useContext(ReaderContext);
  if (!context) {
    throw new Error('useReader must be used within ReaderProvider.');
  }
  return context;
}

import { useState, useEffect, useCallback } from 'react';
import { CATEGORIES } from './data/categories';
import { getSession, onAuthChange } from './lib/auth';
import { fetchSaved, saveArticle, unsaveArticle } from './lib/savedArticles';
import { formatLastUpdated } from './lib/time';

import AuthScreen from './pages/AuthScreen';
import Header from './components/Header';
import TabBar from './components/TabBar';
import HomeView from './pages/HomeView';
import TopicsView from './pages/TopicsView';
import CategoryFeedView from './pages/CategoryFeedView';
import SearchView from './pages/SearchView';
import SavedView from './pages/SavedView';

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = checking, null = signed out
  const [tab, setTab] = useState('home'); // 'home' | 'topics' | 'search' | 'saved'
  const [openCategory, setOpenCategory] = useState(null); // category key, or null

  const [newsData, setNewsData] = useState({});
  const [meta, setMeta] = useState(null);
  const [savedRows, setSavedRows] = useState([]);

  // ---- Auth bootstrap ----
  useEffect(() => {
    getSession().then(setSession);
    return onAuthChange(setSession);
  }, []);

  // ---- Load news data (static JSON written by the RSS pipeline) ----
  useEffect(() => {
    let cancelled = false;

    async function loadNews() {
      const entries = await Promise.all(
        CATEGORIES.map(async (cat) => {
          try {
            const res = await fetch(`/data/${cat.key}.json`);
            const data = res.ok ? await res.json() : [];
            return [cat.key, data];
          } catch {
            return [cat.key, []];
          }
        })
      );
      if (cancelled) return;
      setNewsData(Object.fromEntries(entries));

      try {
        const metaRes = await fetch('/data/meta.json');
        if (metaRes.ok) setMeta(await metaRes.json());
      } catch {
        /* meta is optional -- app still works without a hero story */
      }
    }

    loadNews();
    // Re-check for fresh data periodically without requiring a full page reload.
    const interval = setInterval(loadNews, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // ---- Load saved articles once signed in ----
  useEffect(() => {
    if (!session) {
      setSavedRows([]);
      return;
    }
    fetchSaved().then(setSavedRows).catch(() => setSavedRows([]));
  }, [session]);

  const savedIds = new Set(savedRows.map((r) => `${r.category}::${r.url}`));

  const handleToggleSave = useCallback(
    async (categoryKey, article, saveId) => {
      const existing = savedRows.find((r) => `${r.category}::${r.url}` === saveId);
      if (existing) {
        await unsaveArticle(existing.id);
        setSavedRows((rows) => rows.filter((r) => r.id !== existing.id));
      } else {
        const row = await saveArticle(session.user.id, categoryKey, article);
        setSavedRows((rows) => [row, ...rows]);
      }
    },
    [savedRows, session]
  );

  function openCategoryFeed(key) {
    setOpenCategory(key);
    setTab('topics');
  }

  function goHome() {
    setOpenCategory(null);
    setTab('home');
  }

  if (session === undefined) {
    return null; // brief blank while checking for an existing session
  }

  if (!session) {
    return <AuthScreen onAuthed={setSession} />;
  }

  return (
    <div className="wrap">
      <Header onLogoClick={goHome} lastUpdatedLabel={formatLastUpdated(meta?.lastUpdated)} />

      {tab === 'home' && (
        <HomeView
          newsData={newsData}
          topStory={meta?.topStory}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          onOpenCategory={openCategoryFeed}
        />
      )}

      {tab === 'topics' && openCategory && (
        <CategoryFeedView
          categoryKey={openCategory}
          newsData={newsData}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          onBack={() => setOpenCategory(null)}
        />
      )}

      {tab === 'topics' && !openCategory && <TopicsView onOpenCategory={setOpenCategory} />}

      {tab === 'search' && (
        <SearchView newsData={newsData} savedIds={savedIds} onToggleSave={handleToggleSave} />
      )}

      {tab === 'saved' && (
        <SavedView
          savedRows={savedRows}
          onUnsaved={(row) => setSavedRows((rows) => rows.filter((r) => r.id !== row.id))}
        />
      )}

      <TabBar
        active={tab}
        onChange={(next) => {
          setTab(next);
          if (next !== 'topics') setOpenCategory(null);
        }}
      />
    </div>
  );
}

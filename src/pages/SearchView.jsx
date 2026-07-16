import { useState } from 'react';
import { getCategory } from '../data/categories';
import ArticleCard from '../components/ArticleCard';

export default function SearchView({ newsData, savedIds, onToggleSave }) {
  const [query, setQuery] = useState('');

  const results = [];
  if (query.trim()) {
    const q = query.toLowerCase();
    Object.entries(newsData).forEach(([categoryKey, articles]) => {
      articles.forEach((article) => {
        const haystack = `${article.headline} ${article.summary} ${article.publisher}`.toLowerCase();
        if (haystack.includes(q)) {
          results.push({ categoryKey, article });
        }
      });
    });
  }

  return (
    <div>
      <div className="search-input-row">
        <input
          type="text"
          placeholder="Search headlines..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {query.trim() && results.length === 0 && (
        <div className="empty-state">No matches for "{query}"</div>
      )}

      {results.map(({ categoryKey, article }) => {
        const category = getCategory(categoryKey);
        const saveId = `${categoryKey}::${article.url}`;
        return (
          <ArticleCard
            key={saveId}
            article={article}
            category={category}
            variant="feed"
            isSaved={savedIds.has(saveId)}
            onToggleSave={() => onToggleSave(categoryKey, article, saveId)}
          />
        );
      })}
    </div>
  );
}

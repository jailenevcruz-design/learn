import { getCategory } from '../data/categories';
import ArticleCard from '../components/ArticleCard';
import { dayLabel } from '../lib/time';

export default function CategoryFeedView({ categoryKey, newsData, savedIds, onToggleSave, onBack }) {
  const category = getCategory(categoryKey);
  const articles = newsData[categoryKey] || [];

  let lastDay = null;

  return (
    <div>
      <button className="back-link" onClick={onBack}>← All topics</button>
      {articles.length === 0 && <div className="empty-state">No stories yet for {category.label}.</div>}
      {articles.map((article, i) => {
        const day = dayLabel(article.published_at);
        const showDayLabel = day !== lastDay;
        lastDay = day;
        const saveId = `${categoryKey}::${article.url}`;
        return (
          <div key={article.url || i}>
            {showDayLabel && <div className="day-label">{day}</div>}
            <ArticleCard
              article={article}
              category={category}
              variant="feed"
              isSaved={savedIds.has(saveId)}
              onToggleSave={() => onToggleSave(categoryKey, article, saveId)}
            />
          </div>
        );
      })}
    </div>
  );
}

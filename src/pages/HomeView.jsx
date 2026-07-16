import { CATEGORIES, getCategory } from '../data/categories';
import ArticleCard from '../components/ArticleCard';

/**
 * newsData shape: { [categoryKey]: Article[] } -- newest first, as written by the RSS pipeline.
 * topStory shape: { categoryKey, article } -- picked by the pipeline (e.g. most recent overall).
 */
export default function HomeView({ newsData, topStory, savedIds, onToggleSave, onOpenCategory }) {
  const topCategory = topStory ? getCategory(topStory.categoryKey) : null;

  return (
    <div>
      {topStory && topCategory && (
        <div className="hero" style={{ background: topCategory.color }} onClick={() => onOpenCategory(topCategory.key)}>
          <div className="hero-inner" style={{ background: topCategory.tint }}>
            <img
              className="hero-img"
              src={topStory.article.image_url || `https://picsum.photos/seed/${encodeURIComponent(topStory.article.headline)}/700/400`}
              alt=""
            />
            <div className="hero-body">
              <div className="hero-eyebrow" style={{ color: topCategory.color }}>
                Top story · {topCategory.label}
              </div>
              <h2>{topStory.article.headline}</h2>
              <p>{topStory.article.summary}</p>
            </div>
          </div>
        </div>
      )}

      {CATEGORIES.map((cat) => {
        const articles = newsData[cat.key] || [];
        // Avoid showing the exact same article already featured in the hero.
        const article =
          topStory?.categoryKey === cat.key && articles.length > 1
            ? articles.find((_, i) => i !== 0) || articles[0]
            : articles[0];
        if (!article) return null;

        const saveId = `${cat.key}::${article.url}`;
        return (
          <ArticleCard
            key={cat.key}
            article={article}
            category={cat}
            variant="tile"
            isSaved={savedIds.has(saveId)}
            onToggleSave={() => onToggleSave(cat.key, article, saveId)}
            seeFullFeed={() => onOpenCategory(cat.key)}
          />
        );
      })}
    </div>
  );
}

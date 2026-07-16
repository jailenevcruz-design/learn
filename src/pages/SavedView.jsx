import { getCategory } from '../data/categories';
import { unsaveArticle } from '../lib/savedArticles';

export default function SavedView({ savedRows, onUnsaved }) {
  if (!savedRows.length) {
    return <div className="empty-state">Nothing saved yet — tap the heart on any story to save it here.</div>;
  }

  async function handleUnsave(row) {
    await unsaveArticle(row.id);
    onUnsaved(row);
  }

  return (
    <div>
      {savedRows.map((row) => {
        const category = getCategory(row.category);
        return (
          <div key={row.id} className="feed-row" style={{ borderLeft: `4px solid ${category.color}`, background: category.tint }}>
            <div className="tile-top">
              <img className="tile-img" src={row.image_url || `https://picsum.photos/seed/${encodeURIComponent(row.headline)}/200/200`} alt="" />
              <div className="tile-mid">
                <span className="badge" style={{ background: category.color }}>{category.label}</span>
                <h3>{row.headline}</h3>
                <div className="updated">{row.publisher}</div>
              </div>
            </div>
            <div className="drawer open">
              <p>{row.summary}</p>
              <div className="drawer-footer">
                <a
                  className="read-link"
                  style={{ background: `${category.color}22`, color: category.color }}
                  href={row.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read on {row.publisher} →
                </a>
                <button className="save-btn saved" onClick={() => handleUnsave(row)}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#FF4470" stroke="#FF4470" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

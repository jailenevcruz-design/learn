import { useState } from 'react';
import Icon from './Icon';
import { formatRelativeTime } from '../lib/time';

/**
 * article shape: { headline, summary, publisher, url, image_url, published_at }
 * variant: 'tile' (Home) | 'feed' (category feed / search / saved)
 */
export default function ArticleCard({
  article,
  category,
  variant = 'tile',
  isSaved,
  onToggleSave,
  seeFullFeed,
}) {
  const [open, setOpen] = useState(variant === 'saved');
  const wrapperClass = variant === 'tile' ? 'tile' : 'feed-row';
  const timeLabel = formatRelativeTime(article.published_at);

  return (
    <div className={wrapperClass} style={{ borderLeft: `4px solid ${category.color}`, background: category.tint }}>
      <div className="tile-top" onClick={() => setOpen((o) => !o)}>
        <img
          className="tile-img"
          src={article.image_url || `https://picsum.photos/seed/${encodeURIComponent(article.headline)}/200/200`}
          alt=""
        />
        <div className="tile-mid">
          {variant === 'tile' && (
            <span className="badge" style={{ background: category.color }}>
              <Icon path={category.icon} color="#fff" size={11} />
              {category.label}
            </span>
          )}
          <h3>{article.headline}</h3>
          <div className="updated">
            {variant !== 'tile' && <span className="publisher-tag">{article.publisher}</span>}
            {variant !== 'tile' && ' · '}
            {variant === 'tile' ? `${article.publisher} · ${timeLabel}` : timeLabel}
          </div>
        </div>
      </div>

      <div className={`drawer${open ? ' open' : ''}`}>
        <p>{article.summary}</p>
        <div className="drawer-footer">
          <a
            className="read-link"
            style={{ background: `${category.color}22`, color: category.color }}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read on {article.publisher} →
          </a>
          <button
            className={`save-btn${isSaved ? ' saved' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.();
            }}
          >
            <HeartIcon filled={isSaved} />
          </button>
        </div>
      </div>

      {variant === 'tile' && seeFullFeed && (
        <div className="see-feed" onClick={seeFullFeed}>
          See full {category.label} feed →
        </div>
      )}
    </div>
  );
}

function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill={filled ? '#FF4470' : 'none'} stroke={filled ? '#FF4470' : '#726B80'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
    </svg>
  );
}

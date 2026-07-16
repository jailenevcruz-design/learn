import { CATEGORIES } from '../data/categories';
import Icon from '../components/Icon';

export default function TopicsView({ onOpenCategory }) {
  return (
    <div className="topics-grid">
      {CATEGORIES.map((cat) => (
        <div
          key={cat.key}
          className="topic-chip"
          style={{ background: cat.color }}
          onClick={() => onOpenCategory(cat.key)}
        >
          <Icon path={cat.icon} color="#fff" size={22} />
          <span className="label">{cat.label}</span>
        </div>
      ))}
    </div>
  );
}

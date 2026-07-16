const TABS = [
  {
    key: 'home',
    label: 'Home',
    icon: <path d="M3 11l9-8 9 8M5 10v10h14V10" />,
  },
  {
    key: 'topics',
    label: 'Topics',
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
  },
  {
    key: 'search',
    label: 'Search',
    icon: (
      <>
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </>
    ),
  },
  {
    key: 'saved',
    label: 'Saved',
    icon: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />,
  },
];

export default function TabBar({ active, onChange }) {
  return (
    <div className="tabbar">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`tab-btn${active === tab.key ? ' active' : ''}`}
          onClick={() => onChange(tab.key)}
        >
          <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {tab.icon}
          </svg>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

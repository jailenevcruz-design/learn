// Category definitions: color, light tint (for card backgrounds), and a simple
// line-icon path (rendered via <Icon> in components/Icon.jsx).
// Colors are chosen to stay visually distinct from each other even side by side.

export const CATEGORIES = [
  {
    key: 'politics',
    label: 'Politics',
    color: '#3E5FFF',
    tint: '#E6EAFF',
    icon: '<path d="M12 2v4M8 10h8M6 14l6-4 6 4M4 20h16M6 20v-5M18 20v-5"/>',
    feeds: [
      { name: 'NPR', url: 'https://feeds.npr.org/1014/rss.xml' },
    ],
  },
  {
    key: 'world',
    label: 'World',
    color: '#00BCD4',
    tint: '#DFF7FB',
    icon: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z"/>',
    feeds: [
      { name: 'NPR', url: 'https://feeds.npr.org/1004/rss.xml' },
    ],
  },
  {
    key: 'business',
    label: 'Business',
    color: '#00B889',
    tint: '#DCFBF3',
    icon: '<path d="M3 20h18M6 20V10M12 20V4M18 20v-7"/>',
    feeds: [
      { name: 'NPR', url: 'https://feeds.npr.org/1006/rss.xml' },
      { name: 'CNBC', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html' },
    ],
  },
  {
    key: 'tech',
    label: 'Tech',
    color: '#C61FB3',
    tint: '#F8E1F5',
    icon: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
    feeds: [
      { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
      { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
    ],
  },
  {
    key: 'science',
    label: 'Science',
    color: '#FFC107',
    tint: '#FFF3D9',
    icon: '<path d="M10 2v6L4 20a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-6-12V2"/><path d="M8.5 2h7"/>',
    feeds: [
      { name: 'NPR', url: 'https://feeds.npr.org/1007/rss.xml' },
      { name: 'ScienceDaily', url: 'https://www.sciencedaily.com/rss/all.xml' },
    ],
  },
  {
    key: 'health',
    label: 'Health',
    color: '#FF4757',
    tint: '#FFE3E5',
    icon: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/>',
    feeds: [
      { name: 'NPR', url: 'https://feeds.npr.org/1128/rss.xml' },
    ],
  },
  {
    key: 'sports',
    label: 'Sports',
    color: '#FF8C42',
    tint: '#FFEADD',
    icon: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18M3 12h18"/>',
    feeds: [
      { name: 'ESPN', url: 'https://www.espn.com/espn/rss/news' },
    ],
  },
  {
    key: 'entertainment',
    label: 'Entertainment',
    color: '#5B4FE8',
    tint: '#ECE7FF',
    icon: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M7 6l2-3h6l2 3"/>',
    feeds: [
      { name: 'Variety', url: 'https://variety.com/feed/' },
      { name: 'Rolling Stone', url: 'https://www.rollingstone.com/feed/' },
    ],
  },
  {
    key: 'art',
    label: 'Art',
    color: '#9B4DFF',
    tint: '#F1E5FF',
    icon: '<path d="M12 3a9 9 0 1 0 0 18c1 0 2-.5 2-2 0-.6-.3-1-.6-1.4-.3-.4-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H16a4 4 0 0 0 4-4c0-4.4-3.6-7.5-8-7.5z"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="10.5" cy="7.5" r="1"/><circle cx="14.5" cy="8" r="1"/>',
    feeds: [
      { name: 'Hyperallergic', url: 'https://hyperallergic.com/feed/' },
      { name: 'ARTnews', url: 'https://www.artnews.com/feed/' },
    ],
  },
  {
    key: 'fashion',
    label: 'Fashion',
    color: '#FF4FA3',
    tint: '#FFE3F1',
    icon: '<path d="M9 4l3 2 3-2 4 3-2 3-2-1v11H8V9L6 10 4 7z"/>',
    feeds: [
      { name: 'Vogue', url: 'https://www.vogue.com/feed/rss' },
      { name: 'WWD', url: 'https://wwd.com/feed/' },
    ],
  },
];

export function getCategory(key) {
  return CATEGORIES.find((c) => c.key === key);
}

// Digit colors used on the login/signup keypad -- cosmetic, unrelated to categories.
export const DIGIT_COLORS = {
  0: { c: '#3E5FFF', t: '#E6EAFF' },
  1: { c: '#00BCD4', t: '#DFF7FB' },
  2: { c: '#00B889', t: '#DCFBF3' },
  3: { c: '#5B4FE8', t: '#ECE7FF' },
  4: { c: '#FFC107', t: '#FFF3D9' },
  5: { c: '#FF4757', t: '#FFE3E5' },
  6: { c: '#FF8C42', t: '#FFEADD' },
  7: { c: '#C61FB3', t: '#F8E1F5' },
  8: { c: '#9B4DFF', t: '#F1E5FF' },
  9: { c: '#FF4FA3', t: '#FFE3F1' },
};

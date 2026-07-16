/** "34 min ago", "2 hrs ago", "Jul 15, 9:20 AM" for anything older than a day. */
export function formatRelativeTime(isoString) {
  const then = new Date(isoString);
  const diffMs = Date.now() - then.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? 's' : ''} ago`;
  return then.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ', ' + then.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

/** "Today", "Yesterday", or a formatted date -- used for day-group headers in category feeds. */
export function dayLabel(isoString) {
  const then = new Date(isoString);
  const now = new Date();
  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.round((startOfDay(now) - startOfDay(then)) / 86400000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return then.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
}

/** "Updated 34 min ago" style label for the header pill, from the pipeline's lastUpdated timestamp. */
export function formatLastUpdated(isoString) {
  if (!isoString) return 'Updated —';
  return `Updated ${formatRelativeTime(isoString)}`;
}

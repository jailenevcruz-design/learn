// Fetches every RSS feed defined in src/data/categories.js, merges new items
// into the existing per-category JSON files (so nothing already saved is
// lost), and writes public/data/meta.json with a last-updated timestamp and
// today's "top story" pick.
//
// Deliberately does NOT call any AI/summarization API -- every article's
// "summary" field here is just the publisher's own RSS description, trimmed.
// Run with: node scripts/fetch-news.mjs

import Parser from 'rss-parser';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { CATEGORIES } from '../src/data/categories.js';

const DATA_DIR = path.resolve('public/data');
const MAX_ARTICLES_PER_CATEGORY = 200;
const SUMMARY_MAX_LENGTH = 320;

const parser = new Parser({
  timeout: 15000,
  headers: { 'User-Agent': 'Mozilla/5.0 (compatible; CurrentsBot/1.0)' },
});

function cleanSummary(item) {
  const raw = item.contentSnippet || item.summary || item.content || '';
  const stripped = raw.replace(/\s+/g, ' ').trim();
  if (stripped.length <= SUMMARY_MAX_LENGTH) return stripped;
  return stripped.slice(0, SUMMARY_MAX_LENGTH).trim() + '…';
}

function extractImage(item) {
  if (item.enclosure?.url) return item.enclosure.url;
  const mediaContent = item['media:content'];
  if (mediaContent?.$?.url) return mediaContent.$.url;
  if (Array.isArray(mediaContent) && mediaContent[0]?.$?.url) return mediaContent[0].$.url;
  const mediaThumbnail = item['media:thumbnail'];
  if (mediaThumbnail?.$?.url) return mediaThumbnail.$.url;
  return null;
}

function toPublishedAt(item) {
  const raw = item.isoDate || item.pubDate;
  const d = raw ? new Date(raw) : new Date();
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

async function loadExisting(categoryKey) {
  try {
    const raw = await readFile(path.join(DATA_DIR, `${categoryKey}.json`), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function fetchCategory(category) {
  const feedResults = await Promise.allSettled(
    category.feeds.map((feed) => parser.parseURL(feed.url))
  );

  const fetched = [];
  category.feeds.forEach((feed, i) => {
    const result = feedResults[i];
    if (result.status === 'rejected') {
      console.warn(`[${category.key}] Failed to fetch ${feed.name} (${feed.url}): ${result.reason?.message}`);
      return; // one broken feed shouldn't take down the whole category or run
    }
    for (const item of result.value.items ?? []) {
      if (!item.link || !item.title) continue;
      fetched.push({
        headline: item.title.trim(),
        summary: cleanSummary(item),
        publisher: feed.name,
        url: item.link,
        image_url: extractImage(item),
        published_at: toPublishedAt(item),
      });
    }
  });

  const existing = await loadExisting(category.key);
  const seenUrls = new Set();
  const merged = [];

  // Newest first: fresh fetch results, then existing history, deduped by URL.
  for (const article of [...fetched, ...existing]) {
    if (seenUrls.has(article.url)) continue;
    seenUrls.add(article.url);
    merged.push(article);
  }

  merged.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
  return merged.slice(0, MAX_ARTICLES_PER_CATEGORY);
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });

  console.log(`Fetching ${CATEGORIES.length} categories in parallel...`);
  const results = {};
  const categoryResults = await Promise.all(
    CATEGORIES.map(async (category) => [category.key, await fetchCategory(category)])
  );
  for (const [key, articles] of categoryResults) {
    results[key] = articles;
  }

  for (const [key, articles] of Object.entries(results)) {
    await writeFile(path.join(DATA_DIR, `${key}.json`), JSON.stringify(articles, null, 2));
  }

  // Pick the single most recent article across every category as today's top story.
  let topStory = null;
  for (const [categoryKey, articles] of Object.entries(results)) {
    if (!articles[0]) continue;
    if (!topStory || new Date(articles[0].published_at) > new Date(topStory.article.published_at)) {
      topStory = { categoryKey, article: articles[0] };
    }
  }

  const meta = {
    lastUpdated: new Date().toISOString(),
    topStory,
  };
  await writeFile(path.join(DATA_DIR, 'meta.json'), JSON.stringify(meta, null, 2));

  console.log('Done. Wrote', Object.keys(results).length, 'category files + meta.json');
}

main().catch((err) => {
  console.error('Fatal error in fetch-news.mjs:', err);
  process.exit(1);
});

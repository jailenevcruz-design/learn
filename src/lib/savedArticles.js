import { supabase } from './supabaseClient';

/** Fetches every article the current user has saved, newest first. */
export async function fetchSaved() {
  const { data, error } = await supabase
    .from('currents_saved_articles')
    .select('*')
    .order('saved_at', { ascending: false });
  if (error) throw error;
  return data;
}

/** Saves an article for the current user. `article` matches the shape written by the RSS pipeline. */
export async function saveArticle(userId, categoryKey, article) {
  const { data, error } = await supabase
    .from('currents_saved_articles')
    .insert({
      user_id: userId,
      category: categoryKey,
      headline: article.headline,
      summary: article.summary,
      publisher: article.publisher,
      url: article.url,
      image_url: article.image_url ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Removes a saved article by its row id. */
export async function unsaveArticle(rowId) {
  const { error } = await supabase
    .from('currents_saved_articles')
    .delete()
    .eq('id', rowId);
  if (error) throw error;
}

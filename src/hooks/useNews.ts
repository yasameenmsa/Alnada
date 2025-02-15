import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { Database } from '../types/supabase';

type News = Database['public']['Tables']['news']['Row'];

export function useNews() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setNews(data || []);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    const channel = supabase
      .channel('news_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'news' 
        }, 
        () => {
          fetchNews();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createNews = async (newsData: Omit<News, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Add user_id to news data
      const dataWithUser = {
        ...newsData,
        user_id: user.id,
      };

      const { data, error: createError } = await supabase
        .from('news')
        .insert([dataWithUser])
        .select()
        .single();

      if (createError) throw createError;

      // Refresh news list
      await fetchNews();
      
      return { success: true, data };
    } catch (err) {
      console.error('Error creating news:', err);
      const message = err instanceof Error ? err.message : 'Failed to create news';
      setError(message);
      return { success: false, error: message };
    }
  };

  const updateNews = async (id: string, updates: Partial<News>) => {
    try {
      setError(null);
      const { data, error: updateError } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Refresh news list
      await fetchNews();
      
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update news';
      setError(message);
      return { success: false, error: message };
    }
  };

  const deleteNews = async (id: string) => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Refresh news list
      await fetchNews();
      
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete news';
      setError(message);
      return { success: false, error: message };
    }
  };

  return {
    news,
    loading,
    error,
    createNews,
    updateNews,
    deleteNews,
    refreshNews: fetchNews
  };
}
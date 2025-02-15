import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { Database } from '../types/supabase';

type News = Database['public']['Tables']['news']['Row'];
type Event = Database['public']['Tables']['events']['Row'];
type Report = Database['public']['Tables']['reports']['Row'];

interface UseAdminDataOptions {
  table: 'news' | 'events' | 'reports';
  limit?: number;
  page?: number;
}

export function useAdminData<T extends News | Event | Report>({ 
  table,
  limit = 10,
  page = 1
}: UseAdminDataOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get total count
      const { count, error: countError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      setTotalCount(count || 0);

      // Get paginated data
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;
      setData(data as T[]);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Setup realtime subscription
    const channel = supabase
      .channel(table)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData(prev => [payload.new as T, ...prev].slice(0, limit));
            setTotalCount(prev => prev + 1);
          } else if (payload.eventType === 'DELETE') {
            setData(prev => prev.filter(item => item.id !== payload.old.id));
            setTotalCount(prev => prev - 1);
          } else if (payload.eventType === 'UPDATE') {
            setData(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as T : item
            ));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [table, limit, page]);

  async function deleteItem(id: string) {
    try {
      setError(null);
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh data after deletion
      await fetchData();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete item';
      setError(message);
      return { success: false, error: message };
    }
  }

  async function updateItem(id: string, updates: Partial<T>) {
    try {
      setError(null);
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh data after update
      await fetchData();
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update item';
      setError(message);
      return { success: false, error: message };
    }
  }

  async function createItem(item: Omit<T, 'id' | 'created_at' | 'updated_at'>) {
    try {
      setError(null);
      const { data, error } = await supabase
        .from(table)
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      
      // Refresh data after creation
      await fetchData();
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create item';
      setError(message);
      return { success: false, error: message };
    }
  }

  return {
    data,
    loading,
    error,
    totalCount,
    deleteItem,
    updateItem,
    createItem,
    refresh: fetchData,
  };
}
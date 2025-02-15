import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { Database } from '../types/supabase';

type Report = Database['public']['Tables']['reports']['Row'];

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setReports(data || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();

    const channel = supabase
      .channel('reports_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'reports' 
        }, 
        () => {
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createReport = async (reportData: Omit<Report, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Add user_id to report data
      const dataWithUser = {
        ...reportData,
        user_id: user.id,
      };

      const { data, error: createError } = await supabase
        .from('reports')
        .insert([dataWithUser])
        .select()
        .single();

      if (createError) throw createError;

      // Refresh reports list
      await fetchReports();
      
      return { success: true, data };
    } catch (err) {
      console.error('Error creating report:', err);
      const message = err instanceof Error ? err.message : 'Failed to create report';
      setError(message);
      return { success: false, error: message };
    }
  };

  const updateReport = async (id: string, updates: Partial<Report>) => {
    try {
      setError(null);
      const { data, error: updateError } = await supabase
        .from('reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Refresh reports list
      await fetchReports();
      
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update report';
      setError(message);
      return { success: false, error: message };
    }
  };

  const deleteReport = async (id: string) => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Refresh reports list
      await fetchReports();
      
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete report';
      setError(message);
      return { success: false, error: message };
    }
  };

  return {
    reports,
    loading,
    error,
    createReport,
    updateReport,
    deleteReport,
    refreshReports: fetchReports
  };
}
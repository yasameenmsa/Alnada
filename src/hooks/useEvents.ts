import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { Database } from '../types/supabase';

type Event = Database['public']['Tables']['events']['Row'];

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (fetchError) throw fetchError;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel('events_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'events' 
        }, 
        () => {
          fetchEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setError(null);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Add user_id to event data
      const dataWithUser = {
        ...eventData,
        user_id: user.id,
      };

      const { data, error: createError } = await supabase
        .from('events')
        .insert([dataWithUser])
        .select()
        .single();

      if (createError) throw createError;

      // Refresh events list
      await fetchEvents();
      
      return { success: true, data };
    } catch (err) {
      console.error('Error creating event:', err);
      const message = err instanceof Error ? err.message : 'Failed to create event';
      setError(message);
      return { success: false, error: message };
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      setError(null);
      const { data, error: updateError } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Refresh events list
      await fetchEvents();
      
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update event';
      setError(message);
      return { success: false, error: message };
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Refresh events list
      await fetchEvents();
      
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete event';
      setError(message);
      return { success: false, error: message };
    }
  };

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents: fetchEvents
  };
}
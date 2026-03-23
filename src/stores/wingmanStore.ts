import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { WingmanAction } from '@/types';

interface WingmanState {
  actions: WingmanAction[];
  loading: boolean;
  fetchActions: (dateId: string) => Promise<void>;
  addAction: (action: Omit<WingmanAction, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
}

export const useWingmanStore = create<WingmanState>((set) => ({
  actions: [],
  loading: false,

  fetchActions: async (dateId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('wingman_actions')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq('date_id', dateId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      set({ actions: data || [] });
    } catch (error) {
      console.error('Error fetching wingman actions:', error);
    } finally {
      set({ loading: false });
    }
  },

  addAction: async (action) => {
    set({ loading: true });
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error('Not authenticated');

      const { error } = await supabase.from('wingman_actions').insert([
        {
          ...action,
          user_id: authData.user.id,
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding wingman action:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

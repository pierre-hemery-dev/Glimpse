import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { DateEntry } from '@/types';

interface DatesState {
  dates: DateEntry[];
  friendDates: DateEntry[];
  loading: boolean;
  fetchUserDates: (userId: string) => Promise<void>;
  fetchFriendDates: () => Promise<void>;
  createDate: (date: Omit<DateEntry, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateDate: (id: string, updates: Partial<DateEntry>) => Promise<void>;
  deleteDate: (id: string) => Promise<void>;
}

export const useDatesStore = create<DatesState>((set, get) => ({
  dates: [],
  friendDates: [],
  loading: false,

  fetchUserDates: async (userId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('dates')
        .select('*')
        .eq('user_id', userId)
        .order('calendar_date', { ascending: true });

      if (error) throw error;
      set({ dates: data || [] });
    } catch (error) {
      console.error('Error fetching user dates:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchFriendDates: async () => {
    set({ loading: true });
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        set({ friendDates: [] });
        return;
      }

      const { data: friendships, error: friendshipsError } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', authData.user.id)
        .eq('status', 'accepted');

      if (friendshipsError) throw friendshipsError;

      const friendIds = friendships?.map((f) => f.friend_id) || [];

      if (friendIds.length === 0) {
        set({ friendDates: [] });
        return;
      }

      const { data, error } = await supabase
        .from('dates')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq('visibility', 'friends')
        .in('user_id', friendIds)
        .gte('calendar_date', new Date().toISOString())
        .order('calendar_date', { ascending: true });

      if (error) throw error;
      set({ friendDates: data || [] });
    } catch (error) {
      console.error('Error fetching friend dates:', error);
    } finally {
      set({ loading: false });
    }
  },

  createDate: async (date) => {
    set({ loading: true });
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error('Not authenticated');

      const { error } = await supabase.from('dates').insert([
        {
          ...date,
          user_id: authData.user.id,
        },
      ]);

      if (error) throw error;
      await get().fetchUserDates(authData.user.id);
    } catch (error) {
      console.error('Error creating date:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateDate: async (id, updates) => {
    set({ loading: true });
    try {
      const { error } = await supabase
        .from('dates')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
        await get().fetchUserDates(authData.user.id);
      }
    } catch (error) {
      console.error('Error updating date:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteDate: async (id) => {
    set({ loading: true });
    try {
      const { error } = await supabase.from('dates').delete().eq('id', id);

      if (error) throw error;

      const { data: authData } = await supabase.auth.getUser();
      if (authData.user) {
        await get().fetchUserDates(authData.user.id);
      }
    } catch (error) {
      console.error('Error deleting date:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

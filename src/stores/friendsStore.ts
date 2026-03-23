import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Friendship, Profile } from '@/types';

interface FriendWithProfile extends Friendship {
  friend_profile: Profile;
}

interface FriendsState {
  friends: FriendWithProfile[];
  loading: boolean;
  fetchFriends: (userId: string) => Promise<void>;
}

export const useFriendsStore = create<FriendsState>((set) => ({
  friends: [],
  loading: false,

  fetchFriends: async (userId: string) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          friend_profile:friend_id (
            id,
            username,
            avatar_url,
            created_at
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ friends: data as FriendWithProfile[] || [] });
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      set({ loading: false });
    }
  },
}));

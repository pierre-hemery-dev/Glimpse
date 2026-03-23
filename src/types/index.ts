export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted';
  created_at: string;
}

export type VenueType =
  | 'restaurant'
  | 'cafe'
  | 'bar'
  | 'cinema'
  | 'chez_moi'
  | 'chez_iel'
  | 'exterieur'
  | 'autre';

export type VibeRating =
  | 'desastre'
  | 'pas_ouf'
  | 'bof'
  | 'bien'
  | 'incroyable';

export type Visibility = 'friends' | 'private';

export interface DateEntry {
  id: string;
  user_id: string;
  calendar_date: string;
  pseudo: string;
  venue_type?: VenueType;
  venue_name?: string;
  venue_address?: string;
  venue_lat?: number;
  venue_lng?: number;
  mood_tags?: string[];
  venue_rating?: boolean;
  title?: string;
  description?: string;
  vibe_rating?: VibeRating;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export type WingmanActionType = 'venue_suggestion' | 'validation' | 'advice';

export interface WingmanAction {
  id: string;
  date_id: string;
  user_id: string;
  type: WingmanActionType;
  content?: string;
  venue_name?: string;
  venue_address?: string;
  created_at: string;
  profiles?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

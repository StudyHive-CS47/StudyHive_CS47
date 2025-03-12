import { supabase } from './supabase';

export const subscribeToLeaderboard = (callback) => {
  const subscription = supabase
    .channel('leaderboard_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'leaderboard'
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}; 
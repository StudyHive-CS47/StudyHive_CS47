import { supabase } from '../config/supabase';

export const chatService = {
  getMessages: async (groupId) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:user_id (
          id,
          email,
          university
        )
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  sendMessage: async (groupId, content) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        group_id: groupId,
        user_id: user.id,
        content
      }])
      .select(`
        *,
        sender:user_id (
          id,
          email,
          university
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  subscribeToMessages: (groupId, callback) => {
    return supabase
      .channel(`messages:${groupId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `group_id=eq.${groupId}`
      }, async (payload) => {
        // Fetch full message data including sender
        const { data } = await supabase
          .from('messages')
          .select(`
            *,
            sender:user_id (
              id,
              email,
              university
            )
          `)
          .eq('id', payload.new.id)
          .single();
          
        callback(data);
      })
      .subscribe();
  }
}; 
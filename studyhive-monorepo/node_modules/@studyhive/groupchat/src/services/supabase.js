import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email, password
    });
    if (error) throw error;
    return data;
  },
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};

// Group operations
export const groupApi = {
  createGroup: async (groupData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await supabase
      .from('groups')
      .insert([{
        name: groupData.name,
        university: groupData.university,
        degree: groupData.degree,
        module: groupData.module,
        description: groupData.description,
        admin_id: user.id,
        member_ids: [user.id],
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getAllGroups: async () => {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        profiles:admin_id(*)
      `);

    if (error) throw error;
    return data;
  },

  getMyGroups: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        profiles:admin_id(*)
      `)
      .or(`admin_id.eq.${user.id},member_ids.cs.{${user.id}}`);

    if (error) throw error;
    return data;
  },

  getGroupById: async (groupId) => {
    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        profiles:admin_id(*),
        messages(*)
      `)
      .eq('id', groupId)
      .single();

    if (error) throw error;
    return data;
  }
};

// Chat operations
export const chatApi = {
  sendMessage: async (groupId, content) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await supabase
      .from('messages')
      .insert([{
        group_id: groupId,
        sender_id: user.id,
        content: content,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getMessages: async (groupId) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        profiles:sender_id(*)
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }
};

// File operations
export const fileApi = {
  uploadFile: async (groupId, file) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await supabase.storage
      .from('group-files')
      .upload(`${groupId}/${file.name}`, file);

    if (error) throw error;
    return data;
  },

  getGroupFiles: async (groupId) => {
    const { data, error } = await supabase.storage
      .from('group-files')
      .list(groupId);

    if (error) throw error;
    return data;
  }
};
import { supabase } from '../config/supabase';

export const groupService = {
  createGroup: async (groupData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in');

    // Start a transaction
    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert([{
        name: groupData.name,
        university: groupData.university,
        degree: groupData.degree,
        module: groupData.module,
        description: groupData.description,
        admin_id: user.id
      }])
      .select()
      .single();

    if (groupError) throw groupError;

    // Add creator as a member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert([{
        group_id: group.id,
        user_id: user.id
      }]);

    if (memberError) throw memberError;
    return group;
  },

  getMyGroups: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in');

    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        group_members!inner (user_id),
        admin:admin_id (
          id,
          university
        )
      `)
      .eq('group_members.user_id', user.id);

    if (error) throw error;
    return data || [];
  },

  subscribeToGroups: (callback) => {
    return supabase
      .channel('groups')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'groups'
      }, payload => {
        callback(payload);
      })
      .subscribe();
  },

  joinGroup: async (groupId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in');

    // Get user's profile
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('university')
      .eq('id', user.id)
      .single();

    // Get group details with admin's university
    const { data: group } = await supabase
      .from('groups')
      .select(`
        *,
        admin:admin_id (
          university
        )
      `)
      .eq('id', groupId)
      .single();

    // Auto-approve if universities match
    const autoApprove = userProfile.university === group.admin.university;

    if (autoApprove) {
      const { data, error } = await supabase
        .from('group_members')
        .insert([{
          group_id: groupId,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, autoApproved: true };
    } else {
      const { data, error } = await supabase
        .from('join_requests')
        .insert([{
          group_id: groupId,
          user_id: user.id,
          status: 'PENDING'
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, autoApproved: false };
    }
  }
}; 
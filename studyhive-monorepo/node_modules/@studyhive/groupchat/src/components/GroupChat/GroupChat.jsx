import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';
import MembersList from './MembersList';
import { useGroup } from '../../contexts/GroupContext';
import { supabase } from '../../config/supabase';
import { useAuth } from '../../contexts/AuthContext';

const GroupChat = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchGroupAndMembers = async () => {
      try {
        // Fetch group details
        const { data: groupData, error: groupError } = await supabase
          .from('groups')
          .select('*')
          .eq('id', groupId)
          .single();

        if (groupError) throw groupError;

        // Check if user is a member
        const { data: memberData, error: memberError } = await supabase
          .from('group_members')
          .select('user_id')
          .eq('group_id', groupId)
          .eq('user_id', user.id)
          .single();

        if (memberError && memberError.code !== 'PGRST116') {
          throw memberError;
        }

        if (!memberData) {
          navigate('/my-groups');
          return;
        }

        // Fetch all member IDs
        const { data: membersList, error: membersError } = await supabase
          .from('group_members')
          .select('user_id')
          .eq('group_id', groupId);

        if (membersError) throw membersError;

        // Get member emails in a separate query
        if (membersList?.length) {
          const memberIds = membersList.map(m => m.user_id);
          const { data: users, error: usersError } = await supabase
            .from('profiles') // Assuming you have a profiles table, or use auth.users directly
            .select('email')
            .in('id', memberIds);

          if (!usersError && users) {
            setMembers(users.map(u => u.email));
          }
        }

        // Get admin email
        const { data: adminUser } = await supabase
          .from('profiles') // Assuming you have a profiles table, or use auth.users directly
          .select('email')
          .eq('id', groupData.admin_id)
          .single();

        setGroup({
          ...groupData,
          admin: { email: adminUser?.email || 'Admin' }
        });
        
      } catch (err) {
        console.error('Error fetching group:', err);
        setError('Failed to load group');
        navigate('/my-groups');
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroupAndMembers();
    }
  }, [groupId, user.id, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (error || !group) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="fixed inset-0 z-10 bg-white">
      <div className="h-full flex">
        {/* Left Sidebar - Group Info */}
        <div className="w-80 bg-gray-50 border-r flex flex-col">
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate('/my-groups')}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
            </div>
            <h2 className="text-xl font-bold">{group.name}</h2>
            <p className="text-sm text-gray-600">
              {group.university} • {group.degree}
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-6">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm text-gray-600">{group.description}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Members</h3>
              <MembersList 
                members={members}
                adminEmail={group.admin?.email}
              />
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">{group.name}</h2>
              <p className="text-sm text-gray-500">{group.module}</p>
            </div>
          </div>

          {/* Chat Messages */}
          <ChatWindow groupId={groupId} />
        </div>
      </div>
    </div>
  );
};

export default GroupChat; 
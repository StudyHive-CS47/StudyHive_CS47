package com.groupchat.backend.service;

import com.groupchat.backend.model.Group;
import com.groupchat.backend.model.JoinRequest;
import com.groupchat.backend.repository.GroupRepository;
import com.groupchat.backend.repository.JoinRequestRepository;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Data
@Getter
@Setter
@Service

public class GroupService {
    private final GroupRepository groupRepository;
    private final JoinRequestRepository joinRequestRepository;

    public GroupService(GroupRepository groupRepository, JoinRequestRepository joinRequestRepository) {
        this.groupRepository = groupRepository;
        this.joinRequestRepository = joinRequestRepository;
    }

    public Group createGroup(Group group) {
        group.setCreatedAt(System.currentTimeMillis());

        // Ensure admin is in member list
        if (!group.getMemberEmails().contains(group.getAdminEmail())) {
            group.getMemberEmails().add(group.getAdminEmail());
        }

        return groupRepository.save(group);
    }

    public List<Group> getGroupsByUser(String userEmail) {
        return groupRepository.findByMemberEmailsContaining(userEmail);
    }

    public void createJoinRequest(String groupId, String userEmail) {
        Optional<Group> group = groupRepository.findById(groupId);
        if (group.isPresent()) {
            if (group.get().getMemberEmails().contains(userEmail)) {
                throw new RuntimeException("User is already a member of this group");
            }

            JoinRequest joinRequest = new JoinRequest();
            joinRequest.setGroupId(groupId);
            joinRequest.setUserEmail(userEmail);
            joinRequest.setStatus("PENDING");
            joinRequest.setRequestedAt(System.currentTimeMillis());
            joinRequestRepository.save(joinRequest);
        } else {
            throw new RuntimeException("Group not found");
        }
    }

    public void approveJoinRequest(String groupId, String userEmail) {
        Optional<Group> groupOpt = groupRepository.findById(groupId);
        Optional<JoinRequest> requestOpt = joinRequestRepository.findByGroupIdAndUserEmail(groupId, userEmail);

        if (groupOpt.isPresent() && requestOpt.isPresent()) {
            Group group = groupOpt.get();
            JoinRequest request = requestOpt.get();

            if (!group.getMemberEmails().contains(userEmail)) {
                group.getMemberEmails().add(userEmail);
                groupRepository.save(group);
            }

            request.setStatus("APPROVED");
            joinRequestRepository.save(request);
        } else {
            throw new RuntimeException("Group or join request not found");
        }
    }

    public Optional<Group> getGroupById(String groupId) {
        return groupRepository.findById(groupId);
    }
}
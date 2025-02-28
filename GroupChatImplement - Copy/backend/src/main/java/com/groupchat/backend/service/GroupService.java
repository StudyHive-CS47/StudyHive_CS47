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

    public void createJoinRequest(String groupId, JoinRequest joinRequest) {
        // Check if group exists and get university
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        // Check if a request already exists
        Optional<JoinRequest> existingRequest = joinRequestRepository.findByGroupIdAndEmail(
                groupId,
                joinRequest.getEmail());

        if (existingRequest.isPresent()) {
            throw new RuntimeException("Join request already exists");
        }

        // If universities match, automatically approve and add to group
        if (group.getUniversity().equalsIgnoreCase(joinRequest.getUniversity())) {
            joinRequest.setStatus("APPROVED");
            joinRequestRepository.save(joinRequest);

            // Add user to group members
            if (!group.getMemberEmails().contains(joinRequest.getEmail())) {
                group.getMemberEmails().add(joinRequest.getEmail());
                groupRepository.save(group);
            }
        } else {
            throw new RuntimeException("You can only join groups from your university");
        }
    }

    public void approveJoinRequest(String groupId, String userEmail) {
        // Find the join request using email field
        JoinRequest joinRequest = joinRequestRepository.findByGroupIdAndEmail(groupId, userEmail)
                .orElseThrow(() -> new RuntimeException("Join request not found"));

        // Update the status
        joinRequest.setStatus("APPROVED");
        joinRequestRepository.save(joinRequest);

        // Get the group and add the user
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        if (!group.getMemberEmails().contains(userEmail)) {
            group.getMemberEmails().add(userEmail);
            groupRepository.save(group);
        }
    }

    public Group getGroupById(String groupId) {
        return groupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));
    }

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public List<Group> searchGroups(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return groupRepository.findAll();
        }
        return groupRepository.findByNameContainingIgnoreCase(searchTerm.trim());
    }

    // Get groups where user is a member
    public List<Group> getMyGroups(String userEmail) {
        return groupRepository.findByMemberEmailsContaining(userEmail);
    }
}
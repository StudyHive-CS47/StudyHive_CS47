package com.groupchat.backend.controller;

import com.groupchat.backend.model.Group;
import com.groupchat.backend.service.GroupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "http://localhost:5173")
public class GroupController {
    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody Group group) {
        try {
            Group createdGroup = groupService.createGroup(group);
            return ResponseEntity.ok(createdGroup);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<?> getGroups(@RequestParam String userEmail) {
        try {
            List<Group> groups = groupService.getGroupsByUser(userEmail);
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{groupId}/join")
    public ResponseEntity<?> requestJoin(
            @PathVariable String groupId,
            @RequestParam String userEmail) {
        groupService.createJoinRequest(groupId, userEmail);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{groupId}/approve")
    public ResponseEntity<?> approveJoinRequest(
            @PathVariable String groupId,
            @RequestParam String userEmail) {
        groupService.approveJoinRequest(groupId, userEmail);
        return ResponseEntity.ok().build();
    }
}
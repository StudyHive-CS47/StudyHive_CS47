package com.groupchat.backend.controller;

import com.groupchat.backend.model.Group;
import com.groupchat.backend.model.JoinRequest;
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
            // Set the creator as admin
            group.setAdminEmail(group.getAdminEmail());

            // Add creator to members list if not already present
            if (!group.getMemberEmails().contains(group.getAdminEmail())) {
                group.getMemberEmails().add(group.getAdminEmail());
            }

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
    public ResponseEntity<?> joinGroup(
            @PathVariable String groupId,
            @RequestBody JoinRequest joinRequest) {
        try {
            groupService.createJoinRequest(groupId, joinRequest);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{groupId}/approve")
    public ResponseEntity<?> approveJoinRequest(
            @PathVariable String groupId,
            @RequestParam String userEmail) {
        try {
            groupService.approveJoinRequest(groupId, userEmail);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<Group> getGroupById(@PathVariable String groupId) {
        try {
            Group group = groupService.getGroupById(groupId);
            return ResponseEntity.ok(group);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Group>> getAllGroups() {
        try {
            List<Group> groups = groupService.getAllGroups();
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Group>> searchGroups(@RequestParam(required = false) String name) {
        try {
            List<Group> groups = groupService.searchGroups(name);
            return ResponseEntity.ok(groups);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/my-groups")
    public ResponseEntity<List<Group>> getMyGroups(@RequestParam String email) {
        try {
            List<Group> myGroups = groupService.getMyGroups(email);
            return ResponseEntity.ok(myGroups);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
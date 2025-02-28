package com.groupchat.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "joinRequests")
public class JoinRequest {
    @Id
    private String id;
    private String groupId;
    private String email;
    private String university;
    private String status; // PENDING, APPROVED, REJECTED
    private Long createdAt;

    public JoinRequest() {
    }

    public JoinRequest(String id, String groupId, String email, String university, String status, Long createdAt) {
        this.id = id;
        this.groupId = groupId;
        this.email = email;
        this.university = university;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public String getGroupId() {
        return groupId;
    }

    public String getEmail() {
        return email;
    }

    public String getUniversity() {
        return university;
    }

    public String getStatus() {
        return status;
    }

    public Long getCreatedAt() {
        return createdAt;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }
}
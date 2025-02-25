package com.groupchat.backend.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Getter
@Setter
@Document(collection = "joinRequests")
public class JoinRequest {
    public JoinRequest(String id, String groupId, String userEmail, String status, Long requestedAt) {
        this.id = id;
        this.groupId = groupId;
        this.userEmail = userEmail;
        this.status = status;
        this.requestedAt = requestedAt;
    }

    public JoinRequest() {

    }

    public String getId() {
        return id;
    }

    public String getGroupId() {
        return groupId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setRequestedAt(Long requestedAt) {
        this.requestedAt = requestedAt;
    }

    public String getStatus() {
        return status;
    }

    public Long getRequestedAt() {
        return requestedAt;
    }

    @Id
    private String id;
    private String groupId;
    private String userEmail;
    private String status; // PENDING, APPROVED, REJECTED
    private Long requestedAt;
}
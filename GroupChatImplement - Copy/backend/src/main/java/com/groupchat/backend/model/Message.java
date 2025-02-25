package com.groupchat.backend.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Getter
@Setter
@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    private String groupId;

    public Message(String id, String groupId, String senderEmail, String content, Long timestamp) {
        this.id = id;
        this.groupId = groupId;
        this.senderEmail = senderEmail;
        this.content = content;
        this.timestamp = timestamp;
    }

    public String getId() {
        return id;
    }

    public String getGroupId() {
        return groupId;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public String getContent() {
        return content;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    private String senderEmail;
    private String content;
    private Long timestamp;

    public void setId(String id) {
        this.id = id;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }
}
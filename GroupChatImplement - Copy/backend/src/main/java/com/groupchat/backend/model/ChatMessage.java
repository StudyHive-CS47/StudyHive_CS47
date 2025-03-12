package com.groupchat.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor

public class ChatMessage {
    private String groupId;
    private String senderEmail;
    private String content;
    private String timestamp;

    public ChatMessage(String groupId, String senderEmail, String content, String timestamp) {
        this.groupId = groupId;
        this.senderEmail = senderEmail;
        this.content = content;
        this.timestamp = timestamp;
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

    public String getTimestamp() {
        return timestamp;
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

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
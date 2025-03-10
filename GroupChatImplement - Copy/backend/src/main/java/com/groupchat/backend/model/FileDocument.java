package com.groupchat.backend.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Getter
@Setter
@Document(collection = "files")
public class FileDocument {
    @Id
    private String id;
    private String groupId;

    public String getId() {
        return id;
    }

    public String getGroupId() {
        return groupId;
    }

    public String getName() {
        return name;
    }

    public String getContentType() {
        return contentType;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public byte[] getContent() {
        return content;
    }

    public Long getUploadedAt() {
        return uploadedAt;
    }

    private String name;

    public FileDocument(String id, String groupId, String name, String contentType, String uploadedBy, byte[] content, Long uploadedAt) {
        this.id = id;
        this.groupId = groupId;
        this.name = name;
        this.contentType = contentType;
        this.uploadedBy = uploadedBy;
        this.content = content;
        this.uploadedAt = uploadedAt;
    }

    private String contentType;
    private String uploadedBy;
    private byte[] content;
    private Long uploadedAt;

    public void setId(String id) {
        this.id = id;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    public void setUploadedAt(Long uploadedAt) {
        this.uploadedAt = uploadedAt;
    }
}
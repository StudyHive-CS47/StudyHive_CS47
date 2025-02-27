package com.groupchat.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "files")
public class File {
    @Id
    private String id;
    private String groupId;
    private String fileName;
    private String fileUrl;
    private String uploadedBy;
    private Long uploadedAt;
    private String contentType;
    private Long size;

    public File(String id, String groupId, String fileName, String fileUrl, String uploadedBy, Long uploadedAt, String contentType, Long size) {
        this.id = id;
        this.groupId = groupId;
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.uploadedBy = uploadedBy;
        this.uploadedAt = uploadedAt;
        this.contentType = contentType;
        this.size = size;
    }

    public File() {

    }

    public String getId() {
        return id;
    }

    public String getGroupId() {
        return groupId;
    }

    public String getFileName() {
        return fileName;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public String getUploadedBy() {
        return uploadedBy;
    }

    public Long getUploadedAt() {
        return uploadedAt;
    }

    public String getContentType() {
        return contentType;
    }

    public Long getSize() {
        return size;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setGroupId(String groupId) {
        this.groupId = groupId;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public void setUploadedAt(Long uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public void setSize(Long size) {
        this.size = size;
    }
}
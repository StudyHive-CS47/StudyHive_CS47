package com.groupchat.backend.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.ArrayList;

@Data
@Getter
@Setter
@Document(collection = "groups")
public class Group {
    public void setId(String id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setAdminEmail(String adminEmail) {
        this.adminEmail = adminEmail;
    }

    public void setMemberEmails(List<String> memberEmails) {
        this.memberEmails = memberEmails;
    }

    public void setFileIds(List<String> fileIds) {
        this.fileIds = fileIds;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }

    public Group(String id, String name, String university, String degree, String module, String description,
            String adminEmail, List<String> memberEmails, List<String> fileIds, Long createdAt) {
        this.id = id;
        this.name = name;
        this.university = university;
        this.degree = degree;
        this.module = module;
        this.description = description;
        this.adminEmail = adminEmail;
        this.memberEmails = memberEmails;
        this.fileIds = fileIds;
        this.createdAt = createdAt;
    }

    @Id
    private String id;
    private String name;
    private String description;
    private String university;
    private String degree;
    private String module;
    private String adminEmail;
    private List<String> memberEmails = new ArrayList<>();
    private List<String> fileIds = new ArrayList<>();
    private Long createdAt;

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getUniversity() {
        return university;
    }

    public String getDegree() {
        return degree;
    }

    public String getModule() {
        return module;
    }

    public String getDescription() {
        return description;
    }

    public String getAdminEmail() {
        return adminEmail;
    }

    public List<String> getMemberEmails() {
        return memberEmails;
    }

    public List<String> getFileIds() {
        return fileIds;
    }

    public Long getCreatedAt() {
        return createdAt;
    }
}
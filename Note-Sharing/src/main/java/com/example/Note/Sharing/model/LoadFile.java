package com.example.Note.Sharing.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;


@Document(collection = "files") // MongoDB collection name
public class LoadFile {

    @Id
    private String id;
    private String filename;
    private String fileType;
    private String fileSize;
    private Date uploadDate;
    
    private byte[] file;  // File content stored as byte array
    
    // Fields for categorization
    private String uploaderName;
    private String fileDescription;
    private String universityName;
    private String moduleCode;
    private String moduleLevel;


    // Constructors
    public LoadFile() {}

    public LoadFile(String filename, String fileDescription, String fileType,String fileSize, byte[] file,
                    String uploaderName, String universityName, String moduleCode, String moduleLevel) {
        this.filename = filename;
        this.fileDescription = fileDescription;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.uploadDate = new Date();
        this.file = file;
        this.uploaderName = uploaderName;
        this.universityName = universityName;
        this.moduleCode = moduleCode;
        this.moduleLevel = moduleLevel;

    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getFileSize() {
        return fileSize;
    }

    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }

    public String getUploaderName() {
        return uploaderName;
    }

    public void setUploaderName(String uploaderName) {
        this.uploaderName = uploaderName;
    }

    public String getFileDescription() {
        return fileDescription;
    }

    public void setFileDescription(String fileDescription) {
        this.fileDescription = fileDescription;
    }

    public Date getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(Date uploadDate) {
        this.uploadDate = uploadDate;
    }


    public String getUniversityName() {
        return universityName;
    }

    public void setUniversityName(String universityName) {
        this.universityName = universityName;
    }

    public String getModuleCode() {
        return moduleCode;
    }

    public void setModuleCode(String moduleCode) {
        this.moduleCode = moduleCode;
    }

    public String getModuleLevel() {
        return moduleLevel;
    }

    public void setModuleLevel(String moduleLevel) {
        this.moduleLevel = moduleLevel;
    }
}

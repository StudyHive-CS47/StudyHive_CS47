package com.example.Note.Sharing.service;

import com.example.Note.Sharing.model.LoadFile;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.apache.commons.io.IOUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.util.Date;

@Service
public class FileService {

    @Autowired
    private GridFsTemplate template;

    @Autowired
    private GridFsOperations operations;

    /**
     * Upload a file with metadata
     */
    public LoadFile uploadFile(MultipartFile upload, String universityName, String moduleCode, String moduleLevel,String uploaderName,String fileDescription) throws IOException {




        // Define additional metadata
        DBObject metadata = new BasicDBObject();
        metadata.put("fileSize", upload.getSize());
        metadata.put("fileDescription", fileDescription);
        metadata.put("uploaderName", uploaderName);
        metadata.put("universityName", universityName);
        metadata.put("moduleCode", moduleCode);
        metadata.put("moduleLevel", moduleLevel);
        metadata.put("_contentType", upload.getContentType());

        // Store in database which returns the objectID
        ObjectId fileID = template.store(
                upload.getInputStream(),
                upload.getOriginalFilename(),
                upload.getContentType(),
                metadata
        );

        // Create a LoadFile object with basic info (without the file content)
        LoadFile loadFile = new LoadFile();
        loadFile.setId(fileID.toString());
        loadFile.setUploadDate(new Date());
        loadFile.setFilename(upload.getOriginalFilename());
        loadFile.setFileType(upload.getContentType());
        loadFile.setFileSize(String.valueOf(upload.getSize()));
        loadFile.setFileDescription(fileDescription);
        loadFile.setUploaderName(uploaderName);
        loadFile.setUniversityName(universityName);
        loadFile.setModuleCode(moduleCode);
        loadFile.setModuleLevel(moduleLevel);

        return loadFile;
    }

    /**
     * Download file by ID
     */
    public LoadFile downloadFile(String id) throws IOException {
        // Search file
        GridFSFile gridFSFile = template.findOne(new Query(Criteria.where("_id").is(id)));
        LoadFile loadFile = new LoadFile();

        if (gridFSFile == null) {
            throw new IOException("File not found with ID: " + id);
        }

        if (gridFSFile.getMetadata() != null) {
            loadFile.setId(id);
            loadFile.setUploadDate(gridFSFile.getUploadDate());
            loadFile.setFilename(gridFSFile.getFilename());
            loadFile.setFileType(gridFSFile.getMetadata().get("_contentType").toString());
            loadFile.setFileSize(gridFSFile.getMetadata().get("fileSize").toString());

            // Add metadata if available
            if (gridFSFile.getMetadata().get("fileDescription") != null) {
                loadFile.setFileDescription(gridFSFile.getMetadata().get("fileDescription").toString());
            }
            if (gridFSFile.getMetadata().get("uploaderName") != null) {
                loadFile.setUploaderName(gridFSFile.getMetadata().get("uploaderName").toString());
            }
            if (gridFSFile.getMetadata().get("universityName") != null) {
                loadFile.setUniversityName(gridFSFile.getMetadata().get("universityName").toString());
            }
            if (gridFSFile.getMetadata().get("moduleCode") != null) {
                loadFile.setModuleCode(gridFSFile.getMetadata().get("moduleCode").toString());
            }
            if (gridFSFile.getMetadata().get("moduleLevel") != null) {
                loadFile.setModuleLevel(gridFSFile.getMetadata().get("moduleLevel").toString());
            }

            loadFile.setFile(IOUtils.toByteArray(operations.getResource(gridFSFile).getInputStream()));
        }

        return loadFile;
    }

    /**
     * Get all files (metadata only, no file content)
     */
    public List<LoadFile> getAllFiles() {
        List<GridFSFile> fileList = new ArrayList<>();
        template.find(new Query()).into(fileList);

        return convertGridFSFilesToLoadFiles(fileList, false);
    }

    /**
     * Search files by name
     */
    public List<LoadFile> searchFilesByName(String name) {
        List<GridFSFile> fileList = new ArrayList<>();
        template.find(new Query(Criteria.where("metadata.filename").regex(name, "i"))).into(fileList);


        return convertGridFSFilesToLoadFiles(fileList, false);
    }

    /**
     * Search files by university
     */
    public List<LoadFile> searchFilesByUniversity(String universityName) {
        List<GridFSFile> fileList = new ArrayList<>();
        template.find(new Query(Criteria.where("metadata.universityName").regex(universityName, "i"))).into(fileList);

        return convertGridFSFilesToLoadFiles(fileList, false);
    }

    /**
     * Search files by module code
     */
    public List<LoadFile> searchFilesByModule(String moduleCode) {
        List<GridFSFile> fileList = new ArrayList<>();
        template.find(new Query(Criteria.where("metadata.moduleCode").regex(moduleCode, "i"))).into(fileList);

        return convertGridFSFilesToLoadFiles(fileList, false);
    }

    /**
     * Search files by module level
     */
    public List<LoadFile> searchFilesByLevel(String moduleLevel) {
        List<GridFSFile> fileList = new ArrayList<>();
        template.find(new Query(Criteria.where("metadata.moduleLevel").regex(moduleLevel, "i"))).into(fileList);

        return convertGridFSFilesToLoadFiles(fileList, false);
    }

    /**
     * Search files by multiple criteria
     */
    public List<LoadFile> searchFilesByCategory(Map<String, String> filters) {
        List<GridFSFile> fileList = new ArrayList<>();

        // Build a criteria that includes all non-null parameters
        Criteria criteria = new Criteria();
        List<Criteria> criteriaList = new ArrayList<>();

        String universityName = filters.get("universityName");
        String moduleCode = filters.get("moduleCode");
        String moduleLevel = filters.get("moduleLevel");
        String uploaderName = filters.get("uploaderName");

        if (universityName != null && !universityName.isEmpty()) {
            criteriaList.add(Criteria.where("metadata.universityName").regex(universityName, "i"));
        }

        if (moduleCode != null && !moduleCode.isEmpty()) {
            criteriaList.add(Criteria.where("metadata.moduleCode").regex(moduleCode, "i"));
        }

        if (moduleLevel != null && !moduleLevel.isEmpty()) {
            criteriaList.add(Criteria.where("metadata.moduleLevel").regex(moduleLevel, "i"));
        }

        if (uploaderName != null && !uploaderName.isEmpty()) {
            criteriaList.add(Criteria.where("metadata.uploaderName").regex(uploaderName, "i"));
        }

        // If any criteria were added, build the final criteria
        if (!criteriaList.isEmpty()) {
            criteria = new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
            template.find(new Query(criteria)).into(fileList);
        } else {
            // If no criteria, return all files
            template.find(new Query()).into(fileList);
        }

        return convertGridFSFilesToLoadFiles(fileList, false);
    }

    /**
     * Download all files as a ZIP
     */
    public byte[] downloadFilesAsZip() throws IOException {
        List<GridFSFile> fileList = new ArrayList<>();
        template.find(new Query()).into(fileList);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ZipOutputStream zos = new ZipOutputStrea
        m(baos);

        try {
            for (GridFSFile gridFSFile : fileList) {
                // Create zip entry with the filename
                ZipEntry entry = new ZipEntry(gridFSFile.getFilename());
                zos.putNextEntry(entry);

                // Get file content and write to zip
                byte[] data = IOUtils.toByteArray(operations.getResource(gridFSFile).getInputStream());
                zos.write(data, 0, data.length);
                zos.closeEntry();
            }
            zos.close();
            return baos.toByteArray();
        } catch (IOException e) {
            throw new IOException("Error creating ZIP file: " + e.getMessage(), e);
        }
    }

    /**
     * Helper method to convert GridFSFile list to LoadFile list
     * @param includeContent Whether to include the file content in the result
     */
    private List<LoadFile> convertGridFSFilesToLoadFiles(List<GridFSFile> fileList, boolean includeContent) {
        List<LoadFile> resultList = new ArrayList<>();

        for (GridFSFile gridFSFile : fileList) {
            LoadFile loadFile = new LoadFile();
            loadFile.setId(gridFSFile.getId().asObjectId().getValue().toString());
            loadFile.setFilename(gridFSFile.getFilename());

            loadFile.setUploadDate(gridFSFile.getUploadDate());

            if (gridFSFile.getMetadata() != null) {
                if (gridFSFile.getMetadata().get("_contentType") != null) {
                    loadFile.setFileType(gridFSFile.getMetadata().get("_contentType").toString());
                } else {
                    loadFile.setFileType("application/octet-stream");
                }

                if (gridFSFile.getMetadata().get("fileSize") != null) {
                    loadFile.setFileSize(gridFSFile.getMetadata().get("fileSize").toString());
                } else {
                    loadFile.setFileSize(String.valueOf(gridFSFile.getLength()));
                }

                // Add categorization fields
                if (gridFSFile.getMetadata().get("uploaderName") != null) {
                    loadFile.setUploaderName(gridFSFile.getMetadata().get("uploaderName").toString());
                }
                if (gridFSFile.getMetadata().get("fileDescription") != null) {
                    loadFile.setFileDescription(gridFSFile.getMetadata().get("fileDescription").toString());
                }
                if (gridFSFile.getMetadata().get("universityName") != null) {
                    loadFile.setUniversityName(gridFSFile.getMetadata().get("universityName").toString());
                }
                if (gridFSFile.getMetadata().get("moduleCode") != null) {
                    loadFile.setModuleCode(gridFSFile.getMetadata().get("moduleCode").toString());
                }
                if (gridFSFile.getMetadata().get("moduleLevel") != null) {
                    loadFile.setModuleLevel(gridFSFile.getMetadata().get("moduleLevel").toString());
                }
            } else {
                loadFile.setFileType("application/octet-stream");
                loadFile.setFileSize(String.valueOf(gridFSFile.getLength()));
            }

            // Only include file content if requested (saves memory for listing operations)
            if (includeContent) {
                try {
                    loadFile.setFile(IOUtils.toByteArray(operations.getResource(gridFSFile).getInputStream()));
                } catch (IOException e) {
                    // Log error but continue with other files
                    System.err.println("Error loading file content for " + gridFSFile.getFilename() + ": " + e.getMessage());
                }
            }

            resultList.add(loadFile);
        }

        return resultList;
    }
}
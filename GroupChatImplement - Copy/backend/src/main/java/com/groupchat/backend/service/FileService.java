package com.groupchat.backend.service;

import com.groupchat.backend.model.File;
import com.groupchat.backend.repository.FileRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@Service
public class FileService {
    private final FileRepository fileRepository;

    public FileService(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }

    public List<File> getGroupFiles(String groupId) {
        return fileRepository.findByGroupId(groupId);
    }

    public File saveFile(String groupId, MultipartFile file, String uploadedBy) {
        File fileEntity = new File();
        fileEntity.setGroupId(groupId);
        fileEntity.setFileName(file.getOriginalFilename());
        fileEntity.setContentType(file.getContentType());
        fileEntity.setSize(file.getSize());
        fileEntity.setUploadedBy(uploadedBy);
        fileEntity.setUploadedAt(System.currentTimeMillis());

        // In a real application, you would upload the file to a storage service
        // and set the fileUrl accordingly
        fileEntity.setFileUrl("temporary-url");

        return fileRepository.save(fileEntity);
    }
}

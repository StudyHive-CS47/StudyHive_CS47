package com.groupchat.backend.controller;

import com.groupchat.backend.model.File;
import com.groupchat.backend.service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/groups/{groupId}/files")
@CrossOrigin(origins = "http://localhost:5173")
public class FileController {
    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @GetMapping
    public ResponseEntity<List<File>> getGroupFiles(@PathVariable String groupId) {
        try {
            List<File> files = fileService.getGroupFiles(groupId);
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<File> uploadFile(
            @PathVariable String groupId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("uploadedBy") String uploadedBy) {
        try {
            File savedFile = fileService.saveFile(groupId, file, uploadedBy);
            return ResponseEntity.ok(savedFile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}

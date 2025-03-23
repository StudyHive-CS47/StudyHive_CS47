package com.example.Note.Sharing.controller;

import com.example.Note.Sharing.model.LoadFile;
import com.example.Note.Sharing.service.FileService;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.*;

@RestController
@CrossOrigin(origins = {"http://localhost:5174", "http://localhost:5183"}) // Added multiple origins
@RequestMapping("file")
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired
    private GridFsTemplate template;

    // Endpoint to get all files
    @GetMapping("/list")
    public ResponseEntity<List<LoadFile>> getAllFiles() {
        return ResponseEntity.ok(fileService.getAllFiles());
    }

    // Upload a file
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                        @RequestParam(value = "universityName", required = false) String universityName,
                                        @RequestParam(value = "moduleCode", required = false) String moduleCode,
                                        @RequestParam(value = "moduleLevel", required = false) String moduleLevel,
                                        @RequestParam(value = "uploaderName", required = false) String uploaderName,
                                        @RequestParam(value = "fileDescription", required = false) String fileDescription) {
        try {
            return ResponseEntity.ok(fileService.uploadFile(file, universityName, moduleCode, moduleLevel,uploaderName,fileDescription));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload file: " + e.getMessage());
        }
    }

    // Download a file by ID
    @GetMapping("download/{fileId}")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable String fileId) {
        try {
            LoadFile file = fileService.downloadFile(fileId);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(file.getFileType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                    .body(new ByteArrayResource(file.getFile()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<LoadFile>> searchFilesByName(@RequestParam String filename) {
        System.out.println("Controller received search request with name: " + filename);
        return ResponseEntity.ok(fileService.searchFilesByName(filename));
    }

    // Search files by university
    @GetMapping("/university")
    public ResponseEntity<List<LoadFile>> searchFilesByUniversity(@RequestParam String universityName) {
        return ResponseEntity.ok(fileService.searchFilesByUniversity(universityName));
    }

    // Search files by module
    @GetMapping("/module")
    public ResponseEntity<List<LoadFile>> searchFilesByModule(@RequestParam String moduleCode) {
        return ResponseEntity.ok(fileService.searchFilesByModule(moduleCode));
    }

    // Search files by level
    @GetMapping("/level")
    public ResponseEntity<List<LoadFile>> searchFilesByLevel(@RequestParam String moduleLevel) {
        return ResponseEntity.ok(fileService.searchFilesByLevel(moduleLevel));
    }

    // Search files by category (combined filters)
    @GetMapping("/category")
    public ResponseEntity<List<LoadFile>> searchFilesByCategory(
            @RequestParam(required = false) String universityName,
            @RequestParam(required = false) String moduleCode,
            @RequestParam(required = false) String moduleLevel,
            @RequestParam(required = false) String uploaderName) {
        Map<String, String> filters = new HashMap<>();
        if (universityName != null) filters.put("universityName", universityName);
        if (moduleCode != null) filters.put("moduleCode", moduleCode);
        if (moduleLevel != null) filters.put("moduleLevel", moduleLevel);
        if (uploaderName != null) filters.put("uploaderName", uploaderName);

        return ResponseEntity.ok(fileService.searchFilesByCategory(filters));
    }

    // Download all files as a ZIP
    @GetMapping("/download/zip")
    public ResponseEntity<ByteArrayResource> downloadFilesAsZip() {
        try {
            byte[] zipData = fileService.downloadFilesAsZip();
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"all_files.zip\"")
                    .body(new ByteArrayResource(zipData));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Get file preview
    @GetMapping("/preview/{fileId}")
    public ResponseEntity<ByteArrayResource> previewFile(@PathVariable String fileId) {
        try {
            LoadFile file = fileService.downloadFile(fileId);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(file.getFileType()))
                    .body(new ByteArrayResource(file.getFile()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}

// Move CorsFilter out of the controller class as a separate class
@Component
class CorsFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;

        response.setHeader("Access-Control-Allow-Origin", "http://localhost:5174");
        response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            chain.doFilter(req, res);
        }
    }
}

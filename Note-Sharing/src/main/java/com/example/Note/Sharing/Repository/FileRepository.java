package com.example.Note.Sharing.Repository;

import com.example.Note.Sharing.model.LoadFile;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FileRepository extends MongoRepository<LoadFile, String> {
    List<LoadFile> findByFilenameContainingIgnoreCase(String filename);
}


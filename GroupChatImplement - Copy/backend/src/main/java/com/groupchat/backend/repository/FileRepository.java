package com.groupchat.backend.repository;

import com.groupchat.backend.model.FileDocument;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FileRepository extends MongoRepository<FileDocument, String> {
    List<FileDocument> findByGroupId(String groupId);
}
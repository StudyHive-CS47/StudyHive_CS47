package com.groupchat.backend.repository;

import com.groupchat.backend.model.File;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FileRepository extends MongoRepository<File, String> {
    List<File> findByGroupId(String groupId);
}
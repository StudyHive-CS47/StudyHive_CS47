package com.groupchat.backend.repository;

import com.groupchat.backend.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
    List<Message> findByGroupIdOrderByTimestampDesc(String groupId);
}
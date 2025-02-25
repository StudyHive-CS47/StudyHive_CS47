package com.groupchat.backend.repository;

import com.groupchat.backend.model.JoinRequest;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface JoinRequestRepository extends MongoRepository<JoinRequest, String> {
    Optional<JoinRequest> findByGroupIdAndUserEmail(String groupId, String userEmail);
}
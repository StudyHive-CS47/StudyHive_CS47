package com.groupchat.backend.repository;

import com.groupchat.backend.model.Group;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface GroupRepository extends MongoRepository<Group, String> {
    List<Group> findByMemberEmailsContaining(String userEmail);
}
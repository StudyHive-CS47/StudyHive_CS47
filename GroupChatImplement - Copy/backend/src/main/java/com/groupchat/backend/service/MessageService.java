package com.groupchat.backend.service;

import com.groupchat.backend.model.Message;
import com.groupchat.backend.repository.MessageRepository;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;
import java.util.List;
@Data
@Getter
@Setter
@Service

public class MessageService {
    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public Message saveMessage(Message message) {
        message.setTimestamp(System.currentTimeMillis());
        return messageRepository.save(message);
    }

    public List<Message> getGroupMessages(String groupId) {
        return messageRepository.findByGroupIdOrderByTimestampDesc(groupId);
    }
}
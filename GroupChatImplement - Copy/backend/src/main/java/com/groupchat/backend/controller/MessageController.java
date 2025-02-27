package com.groupchat.backend.controller;

import com.groupchat.backend.model.Message;
import com.groupchat.backend.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups/{groupId}/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping
    public ResponseEntity<List<Message>> getGroupMessages(@PathVariable String groupId) {
        try {
            List<Message> messages = messageService.getGroupMessages(groupId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<Message> createMessage(
            @PathVariable String groupId,
            @RequestBody Message message) {
        try {
            message.setGroupId(groupId);
            Message savedMessage = messageService.saveMessage(message);
            return ResponseEntity.ok(savedMessage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
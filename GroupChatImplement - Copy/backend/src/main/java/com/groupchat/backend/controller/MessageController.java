package com.groupchat.backend.controller;

import com.groupchat.backend.model.ChatMessage;
import com.groupchat.backend.model.Message;
import com.groupchat.backend.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/groups/{groupId}/messages")
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public MessageController(MessageService messageService, SimpMessagingTemplate messagingTemplate) {
        this.messageService = messageService;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void handleChatMessage(ChatMessage chatMessage) {
        try {
            // Save to database
            Message message = new Message();
            message.setGroupId(chatMessage.getGroupId());
            message.setSenderEmail(chatMessage.getSenderEmail());
            message.setContent(chatMessage.getContent());
            message.setTimestamp(System.currentTimeMillis());
            messageService.saveMessage(message);

            // Broadcast to subscribers
            messagingTemplate.convertAndSend("/topic/group/" + chatMessage.getGroupId(), chatMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
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
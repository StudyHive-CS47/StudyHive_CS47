package com.groupchat.backend.controller;

import com.groupchat.backend.model.Message;
import com.groupchat.backend.service.MessageService;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@Data
@Getter
@Setter
public class MessageController {
    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

    public MessageController(SimpMessagingTemplate messagingTemplate, MessageService messageService) {
        this.messagingTemplate = messagingTemplate;
        this.messageService = messageService;
    }

    @MessageMapping("/chat")
    public void processMessage(@Payload Message message) {
        Message saved = messageService.saveMessage(message);
        messagingTemplate.convertAndSend(
                "/topic/group/" + saved.getGroupId(),
                saved
        );
    }
}
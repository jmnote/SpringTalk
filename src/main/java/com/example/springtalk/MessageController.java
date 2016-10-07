package com.example.springtalk;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

    @MessageMapping("/message")
    @SendTo("/topic/messages")
    public Message transfer(Message message) throws Exception {
        Thread.sleep(200);
        return message;
    }
}
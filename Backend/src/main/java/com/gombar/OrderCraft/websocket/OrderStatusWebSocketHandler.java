package com.gombar.OrderCraft.websocket;

import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.socket.CloseStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.CopyOnWriteArraySet;

public class OrderStatusWebSocketHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(OrderStatusWebSocketHandler.class);
    private final Set<WebSocketSession> sessions = new CopyOnWriteArraySet<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        logger.info("WebSocket connection established. Total sessions: " + sessions.size());

        // Send welcome message
        Map<String, String> message = new HashMap<>();
        message.put("type", "CONNECTED");
        message.put("message", "Connected to order tracking system");
        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            String payload = message.getPayload();
            Map<String, Object> data = objectMapper.readValue(payload, Map.class);

            String messageType = (String) data.get("type");

            if ("ORDER_STATUS_UPDATE".equals(messageType)) {
                // Broadcast order status update to all connected clients
                broadcastMessage(data);
            } else if ("PING".equals(messageType)) {
                // Handle keep-alive ping
                Map<String, String> pong = new HashMap<>();
                pong.put("type", "PONG");
                session.sendMessage(new TextMessage(objectMapper.writeValueAsString(pong)));
            }
        } catch (Exception e) {
            logger.error("Error handling WebSocket message", e);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        sessions.remove(session);
        logger.info("WebSocket connection closed. Total sessions: " + sessions.size());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        logger.error("WebSocket transport error", exception);
        session.close(CloseStatus.SERVER_ERROR);
        sessions.remove(session);
    }

    public void broadcastMessage(Map<String, Object> message) {
        String payload;
        try {
            payload = objectMapper.writeValueAsString(message);
        } catch (Exception e) {
            logger.error("Error serializing message", e);
            return;
        }

        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(payload));
                } catch (IOException e) {
                    logger.error("Error sending WebSocket message", e);
                }
            }
        }
    }
}
package com.ecosphere.controller;

import com.ecosphere.dto.NotificationResponse;
import com.ecosphere.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationResponse> getMyNotifications() {
        return notificationService.getMyNotifications();
    }

    @GetMapping("/all")
    public List<NotificationResponse> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @PutMapping("/{id}/read")
    public NotificationResponse markAsRead(@PathVariable Long id) {
        return notificationService.markAsRead(id);
    }

    @PostMapping("/{id}/respond")
    public void respondToClosure(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        boolean accept = body.getOrDefault("accept", false);
        notificationService.respondToClosure(id, accept);
    }
}

package com.ecosphere.service;

import com.ecosphere.dto.NotificationResponse;

import java.util.List;

public interface NotificationService {
    List<NotificationResponse> getMyNotifications();
    List<NotificationResponse> getAllNotifications();
    NotificationResponse markAsRead(Long id);
    void respondToClosure(Long notificationId, boolean accept);
}

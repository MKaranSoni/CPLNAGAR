package com.ecosphere.service.impl;

import com.ecosphere.dto.NotificationResponse;
import com.ecosphere.entity.Complaint;
import com.ecosphere.entity.ComplaintStatus;
import com.ecosphere.entity.Notification;
import com.ecosphere.entity.NotificationType;
import com.ecosphere.entity.User;
import com.ecosphere.repository.ComplaintRepository;
import com.ecosphere.repository.NotificationRepository;
import com.ecosphere.repository.UserRepository;
import com.ecosphere.service.NotificationService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository, ComplaintRepository complaintRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.complaintRepository = complaintRepository;
    }

    @Override
    public List<NotificationResponse> getMyNotifications() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<NotificationResponse> getAllNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public NotificationResponse markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        return convertToResponse(saved);
    }

    @Override
    public void respondToClosure(Long notificationId, boolean accept) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (notification.getType() != NotificationType.CLOSURE_REQUEST) {
            throw new RuntimeException("Not a closure request notification");
        }

        Complaint complaint = notification.getComplaint();
        if (complaint == null) {
            throw new RuntimeException("Complaint not found for this notification");
        }

        if (accept) {
            complaint.setStatus(ComplaintStatus.RESOLVED);
            complaint.setClosureApprovedAt(LocalDateTime.now());
        } else {
            complaint.setClosureRejectedAt(LocalDateTime.now());
        }
        
        complaintRepository.save(complaint);
        
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    private NotificationResponse convertToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .complaintId(notification.getComplaint() != null ? notification.getComplaint().getId() : null)
                .message(notification.getMessage())
                .type(notification.getType().name())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}

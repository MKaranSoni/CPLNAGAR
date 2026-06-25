package com.ecosphere.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private Long id;
    private Long complaintId;
    private String message;
    private String type;
    private boolean isRead;
    private LocalDateTime createdAt;
}

package com.ecosphere.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private String userName;
    private String message;
    private LocalDateTime createdAt;
}

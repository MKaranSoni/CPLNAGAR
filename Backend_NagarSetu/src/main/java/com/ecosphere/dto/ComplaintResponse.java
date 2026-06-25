package com.ecosphere.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ComplaintResponse {

    private Long id;

    private String title;

    private String description;

    private String category;

    private String city;
    private String landmark;

    private String wardName;
    private String wardNumber;

    private String severity;

    private String status;

    private Double latitude;

    private Double longitude;

    private String imageUrl;

    private Integer upvoteCount;
//    private Integer priorityScore;

    private LocalDateTime createdAt;
    private LocalDateTime closureRequestedAt;
    private LocalDateTime closureApprovedAt;
    private LocalDateTime closureRejectedAt;

    private Integer authenticityPercentage;

    private Boolean duplicateImage;

    private UserResponse user;

    private Boolean suspicious;
}
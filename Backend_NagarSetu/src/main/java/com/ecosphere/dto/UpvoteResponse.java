package com.ecosphere.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UpvoteResponse {
    private Long complaintId;
    private Integer upvoteCount;
}
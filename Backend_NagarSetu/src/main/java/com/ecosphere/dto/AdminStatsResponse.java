package com.ecosphere.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminStatsResponse {
    private long totalComplaints;
    private long pending;
    private long inProgress;
    private long resolved;
    private long rejected;
    private long aiDuplicatesFiltered;
}
package com.ecosphere.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatsResponse {
    private long totalComplaints;
    private long resolvedComplaints;
    private CompactComplaintDto mostUpvotedComplaint;
}

package com.ecosphere.service;

import com.ecosphere.dto.*;
import com.ecosphere.entity.ComplaintStatus;

import java.util.List;

public interface AdminService {

    AdminStatsResponse getOverviewStats();

    List<CategoryStatsResponse> getCategoryStats();

    List<ComplaintResponse> getTopComplaints(int limit);

    List<ComplaintResponse> getRecentComplaints(int limit);

    ComplaintResponse forceUpdateStatus(Long id, ComplaintStatus status);
    
    ComplaintResponse requestClosure(Long id);

    void deleteComplaint(Long id);
}
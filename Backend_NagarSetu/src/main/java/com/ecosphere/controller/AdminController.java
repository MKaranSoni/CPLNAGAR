package com.ecosphere.controller;

import com.ecosphere.dto.*;
import com.ecosphere.entity.ComplaintStatus;
import com.ecosphere.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public AdminStatsResponse getStats() {
        return adminService.getOverviewStats();
    }

    @PostMapping("/complaints/{id}/request-closure")
    public ComplaintResponse requestClosure(@PathVariable Long id) {
        return adminService.requestClosure(id);
    }


    @GetMapping("/stats/categories")
    public List<CategoryStatsResponse> getCategoryStats() {
        return adminService.getCategoryStats();
    }

    @GetMapping("/complaints/top")
    public List<ComplaintResponse> topComplaints(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return adminService.getTopComplaints(limit);
    }
    @GetMapping("/complaints/recent")
    public List<ComplaintResponse> recentComplaints(
            @RequestParam(defaultValue = "10") int limit
    ) {
        return adminService.getRecentComplaints(limit);
    }
}
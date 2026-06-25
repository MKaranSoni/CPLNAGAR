package com.ecosphere.controller;

import com.ecosphere.dto.ComplaintResponse;
import com.ecosphere.dto.CreateComplaintRequest;
import com.ecosphere.dto.UpvoteResponse;
import com.ecosphere.service.CloudinaryService;
import org.springframework.security.access.prepost.PreAuthorize;
import com.ecosphere.entity.Complaint;
import org.springframework.security.core.context.SecurityContextHolder;
import com.ecosphere.entity.ComplaintStatus;
import com.ecosphere.entity.SeverityLevel;
import com.ecosphere.service.ComplaintService;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;
    private final CloudinaryService cloudinaryService;

    public ComplaintController(
            ComplaintService complaintService,
            CloudinaryService cloudinaryService
    ) {
        this.complaintService = complaintService;
        this.cloudinaryService = cloudinaryService;
    }
    @GetMapping("/feed")
    public List<ComplaintResponse> getFeed() {
        return complaintService.getLatestComplaints();
    }
//    @GetMapping("/latest")
//    public List<ComplaintResponse> getLatestComplaints() {
//        return complaintService.getLatestComplaints();
//    }
    @PostMapping("/upload-image")
    public String uploadImage(
            @RequestParam("file") MultipartFile file
    ) throws IOException {

        return cloudinaryService.uploadFile(file);
    }

    @PostMapping("/upload")
    public ComplaintResponse createComplaint(

            @RequestParam String title,
            @RequestParam String description,
//            @RequestParam String category,
            @RequestParam Double latitude,
            @RequestParam Double longitude,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String wardName,
            @RequestParam(required = false) String wardNumber,

            @RequestParam(value = "image", required = false)
            MultipartFile image
    ) {

        CreateComplaintRequest request =
                new CreateComplaintRequest();

        request.setTitle(title);
        request.setDescription(description);
//        request.setCategory(category);
        request.setLatitude(latitude);
        request.setLongitude(longitude);
        request.setCity(city);
        request.setWardName(wardName);
        request.setWardNumber(wardNumber);

        return complaintService.createComplaint(
                request,
                image
        );
    }


    @GetMapping
    public Page<ComplaintResponse> getAllComplaints(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        return complaintService.getAllComplaints(pageable);
    }
    
    @GetMapping("/city")
    public Page<ComplaintResponse> getComplaintsByCity(
            @RequestParam String city,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        return complaintService.getComplaintsByCity(city, pageable);
    }
    
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ComplaintResponse updateComplaintStatus(
            @PathVariable Long id,
            @RequestParam ComplaintStatus status
    ) {
        return complaintService.updateComplaintStatus(id, status);
    }
    @GetMapping("/status")
    public List<ComplaintResponse> getComplaintsByStatus(
            @RequestParam ComplaintStatus status
    ) {
        return complaintService.getComplaintsByStatus(status);
    }
    @GetMapping("/category")
    public List<ComplaintResponse> getComplaintsByCategory(
            @RequestParam String category
    ) {
        return complaintService.getComplaintsByCategory(category);
    }

    @GetMapping("/severity")
    public List<ComplaintResponse> getComplaintsBySeverity(
            @RequestParam SeverityLevel severity
    ) {
        return complaintService.getComplaintsBySeverity(severity);
    }
    @PostMapping("/{id}/upvote")
    public UpvoteResponse addUpvote(
            @PathVariable Long id
    ) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return complaintService.addUpvote(id, email);
    }
    @DeleteMapping("/{id}/upvote")
    public UpvoteResponse removeUpvote(
            @PathVariable Long id
    ) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return complaintService.removeUpvote(id, email);
    }
    @GetMapping("/my")
    public List<ComplaintResponse> getMyComplaints() {

        return complaintService.getMyComplaints();
    }
}
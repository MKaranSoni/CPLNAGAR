package com.ecosphere.service;

import com.ecosphere.dto.ComplaintResponse;
import com.ecosphere.dto.UpvoteResponse;
import com.ecosphere.entity.Complaint;
import org.springframework.web.multipart.MultipartFile;
import com.ecosphere.dto.CreateComplaintRequest;
import com.ecosphere.entity.ComplaintStatus;
import com.ecosphere.entity.SeverityLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ComplaintService {

    ComplaintResponse createComplaint(
            CreateComplaintRequest request,
            MultipartFile image

    );



    ComplaintResponse updateComplaintStatus(Long id, ComplaintStatus status);

    List<ComplaintResponse> getLatestComplaints();

    List<ComplaintResponse> getComplaintsByStatus(ComplaintStatus status);

    Page<ComplaintResponse> getAllComplaints(Pageable pageable);

    Page<ComplaintResponse> getComplaintsByCity(String city, Pageable pageable);

    List<ComplaintResponse> getComplaintsByCategory(String category);

    List<ComplaintResponse> getComplaintsBySeverity(SeverityLevel severity);
    UpvoteResponse addUpvote(Long id, String email);
    UpvoteResponse removeUpvote(Long complaintId, String email);
    List<ComplaintResponse> getMyComplaints();

}

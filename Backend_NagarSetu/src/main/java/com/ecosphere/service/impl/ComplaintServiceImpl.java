package com.ecosphere.service.impl;

import com.ecosphere.dto.*;
import com.ecosphere.entity.*;
import com.ecosphere.repository.*;
import com.ecosphere.service.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional
public class ComplaintServiceImpl implements ComplaintService {

    private static final Logger logger = LoggerFactory.getLogger(ComplaintServiceImpl.class);

    private final UpvoteRepository upvoteRepository;
    private final SeverityDetectionService severityDetectionService;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final ImageMetadataService imageMetadataService;
    private final ImageHashService imageHashService;
    private final AuthenticityService authenticityService;

    public ComplaintServiceImpl(
            ComplaintRepository complaintRepository,
            UpvoteRepository upvoteRepository,
            UserRepository userRepository,
            CloudinaryService cloudinaryService,
            SeverityDetectionService severityDetectionService,
            ImageMetadataService imageMetadataService,
            ImageHashService imageHashService,
            AuthenticityService authenticityService
    ) {
        this.complaintRepository = complaintRepository;
        this.upvoteRepository = upvoteRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
        this.severityDetectionService =
                severityDetectionService;
        this.imageMetadataService =
                imageMetadataService;
        this.imageHashService= imageHashService;
        this.authenticityService = authenticityService;

    }

    // ---------------- PRIORITY ----------------
//    private int calculatePriority(SeverityLevel severity, int upvotes) {
//
//        if (severity == null) return upvotes;
//
//        int severityScore = switch (severity) {
//            case LOW -> 1;
//            case MODERATE -> 3;
//            case HIGH -> 5;
//            case CRITICAL -> 8;
//        };
//
//        return severityScore + upvotes;
//    }

    // ---------------- CREATE COMPLAINT ----------------
    @Override
    public ComplaintResponse createComplaint(
            CreateComplaintRequest request,
            MultipartFile image
    ) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = new Complaint();
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(autoTag(request.getTitle(), request.getDescription()));
        complaint.setCity(request.getCity());
        complaint.setLandmark(request.getLandmark());
        complaint.setWardName(request.getWardName());
        complaint.setWardNumber(request.getWardNumber());
        complaint.setLatitude(request.getLatitude());
        complaint.setLongitude(request.getLongitude());
        complaint.setUser(user);
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setStatus(ComplaintStatus.PENDING);
        if (image != null && !image.isEmpty()) {

            SeverityLevel severity =
                    severityDetectionService
                            .detectSeverity(
                                    image,
                                    request.getDescription()
                            );

            complaint.setSeverity(severity);
            boolean suspicious =
                    imageMetadataService
                            .isSuspicious(image);

            complaint.setSuspicious(
                    suspicious
            );
            String hash =
                    imageHashService
                            .generateHash(image);

            complaint.setImageHash(hash);

            boolean duplicate =
                    complaintRepository
                            .existsByImageHash(hash);

            complaint.setDuplicateImage(
                    duplicate
            );
            Integer authenticity =
                    authenticityService.calculateAuthenticity(
                            suspicious,
                            duplicate
                    );


            complaint.setAuthenticityPercentage(
                    authenticity
            );

        } else {

            complaint.setSeverity(
                    SeverityLevel.MODERATE
            );
        }

        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryService.uploadFile(image);
            complaint.setImageUrl(imageUrl);
        }

        complaint.setUpvoteCount(0);
//        //complaint.setPriorityScore(calculatePriority(complaint.getSeverity(), 0));

        Complaint saved = complaintRepository.save(complaint);
        return convertToResponse(saved);
    }
    @Override
    public List<ComplaintResponse> getLatestComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }


    // ---------------- PAGINATION (FIXED) ----------------
    @Override
    public Page<ComplaintResponse> getAllComplaints(Pageable pageable) {
        return complaintRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    @Override
    public Page<ComplaintResponse> getComplaintsByCity(String city, Pageable pageable) {
        return complaintRepository.findByCityOrderByCreatedAtDesc(city, pageable)
                .map(this::convertToResponse);
    }

    // ---------------- FILTERS ----------------
    @Override
    public List<ComplaintResponse> getComplaintsByStatus(ComplaintStatus status) {
        return complaintRepository.findByStatus(status)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<ComplaintResponse> getComplaintsByCategory(String category) {
        return complaintRepository.findByCategory(category)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    public List<ComplaintResponse> getComplaintsBySeverity(SeverityLevel severity) {
        return complaintRepository.findBySeverity(severity)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // ---------------- STATUS UPDATE ----------------
    @Override
    public ComplaintResponse updateComplaintStatus(Long id, ComplaintStatus status) {

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(status);

        return convertToResponse(complaintRepository.save(complaint));
    }

    // ---------------- UPVOTE ----------------
    @Override
    public UpvoteResponse addUpvote(Long complaintId, String email) {
        logger.info("Processing upvote for Complaint ID: {}", complaintId);
        logger.info("Authenticated User Email: {}", email);

        try {
            Complaint complaint = complaintRepository.findById(complaintId)
                    .orElseThrow(() -> new RuntimeException("Complaint not found."));

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found."));

            logger.info("Authenticated User ID: {}, Complaint Owner ID: {}", user.getId(), complaint.getUser().getId());

            if (complaint.getUser().getId().equals(user.getId())) {
                logger.warn("Validation Result: Failed. Exception Message: Users cannot upvote their own complaints.");
                throw new RuntimeException("Users cannot upvote their own complaints.");
            }

            boolean exists = upvoteRepository.findByUserAndComplaint(user, complaint).isPresent();

            if (exists) {
                logger.warn("Validation Result: Failed. Exception Message: You have already upvoted this complaint.");
                throw new RuntimeException("You have already upvoted this complaint.");
            }

            logger.info("Validation Result: Passed. Registering upvote.");

            Upvote upvote = Upvote.builder()
                    .user(user)
                    .complaint(complaint)
                    .build();

            upvoteRepository.save(upvote);

            complaint.setUpvoteCount(complaint.getUpvoteCount() + 1);
            complaintRepository.save(complaint);

            return new UpvoteResponse(complaint.getId(), complaint.getUpvoteCount());
        } catch (Exception e) {
            logger.error("Upvote failed: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public UpvoteResponse removeUpvote(Long complaintId, String email) {

        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Upvote upvote = upvoteRepository.findByUserAndComplaint(user, complaint)
                .orElseThrow(() -> new RuntimeException("Upvote not found"));

        upvoteRepository.delete(upvote);

        complaint.setUpvoteCount(complaint.getUpvoteCount() - 1);
        //complaint.setPriorityScore(calculatePriority(complaint.getSeverity(), complaint.getUpvoteCount()));
        complaint.setUpvoteCount(
                complaint.getUpvoteCount() - 1
        );

        //complaintRepository.save(complaint);
        complaintRepository.save(complaint);

        return new UpvoteResponse(complaint.getId(), complaint.getUpvoteCount());
    }

    // ---------------- MY COMPLAINTS ----------------
    @Override
    public List<ComplaintResponse> getMyComplaints() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return complaintRepository.findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // ---------------- CATEGORY AUTO TAG ----------------
    private String autoTag(String title, String description) {

        String text = (title + " " + description).toLowerCase();

        if (text.contains("road") || text.contains("pothole") || text.contains("street"))
            return "ROAD";

        if (text.contains("water") || text.contains("pipeline") || text.contains("drain"))
            return "WATER";

        if (text.contains("electricity") || text.contains("light") || text.contains("power"))
            return "ELECTRICITY";

        if (text.contains("garbage") || text.contains("waste") || text.contains("dirty"))
            return "SANITATION";

        if (text.contains("traffic") || text.contains("signal") || text.contains("jam"))
            return "TRAFFIC";

        if (text.contains("crime") || text.contains("theft") || text.contains("unsafe"))
            return "PUBLIC_SAFETY";

        if (text.contains("dog") || text.contains("cow"))
            return "ANIMAL_CONTROL";

        if (text.contains("park") || text.contains("tree"))
            return "PARKS";

        return "OTHER";
    }

    // ---------------- DTO MAPPER (FIXED ACCESS) ----------------
    public ComplaintResponse convertToResponse(Complaint complaint) {

        return ComplaintResponse.builder()
                .id(complaint.getId())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .category(complaint.getCategory())
                .city(complaint.getCity())
                .landmark(complaint.getLandmark())
                .wardName(complaint.getWardName())
                .wardNumber(complaint.getWardNumber())
                .severity(complaint.getSeverity() != null ? complaint.getSeverity().name() : null)
                .status(complaint.getStatus() != null ? complaint.getStatus().name() : null)
                .latitude(complaint.getLatitude())
                .longitude(complaint.getLongitude())
                .imageUrl(complaint.getImageUrl())
                .duplicateImage(
                        complaint.getDuplicateImage() != null
                                ? complaint.getDuplicateImage()
                                : false
                )
                .suspicious(
                        complaint.getSuspicious() != null
                                ? complaint.getSuspicious()
                                : false
                )
                .authenticityPercentage(
                        complaint.getAuthenticityPercentage()
                )
                .upvoteCount(complaint.getUpvoteCount())
                //.priorityScore(complaint.getPriorityScore())
                .createdAt(complaint.getCreatedAt())
                .closureRequestedAt(complaint.getClosureRequestedAt())
                .closureApprovedAt(complaint.getClosureApprovedAt())
                .closureRejectedAt(complaint.getClosureRejectedAt())
                .user(UserResponse.builder()
                        .id(complaint.getUser().getId())
                        .name(complaint.getUser().getName())
                        .email(complaint.getUser().getEmail())
                        .role(complaint.getUser().getRole().name())
                        .build())
                .build();
    }
}
package com.ecosphere.service.impl;

import com.ecosphere.dto.UserResponse;
import com.ecosphere.dto.UserStatsResponse;
import com.ecosphere.dto.CompactComplaintDto;
import com.ecosphere.entity.Complaint;
import com.ecosphere.entity.ComplaintStatus;
import com.ecosphere.entity.User;
import com.ecosphere.repository.ComplaintRepository;
import com.ecosphere.repository.UserRepository;
import com.ecosphere.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;

    @Override
    public UserResponse getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Override
    public UserStatsResponse getUserStats() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long total = complaintRepository.countByUser(user);
        long resolved = complaintRepository.countByUserAndStatus(user, ComplaintStatus.RESOLVED);
        
        CompactComplaintDto topComplaint = complaintRepository.findFirstByUserOrderByUpvoteCountDescCreatedAtDesc(user)
                .map(c -> new CompactComplaintDto(
                        c.getId(),
                        c.getTitle(),
                        c.getUpvoteCount(),
                        c.getStatus().name(),
                        c.getCategory()
                )).orElse(null);

        return new UserStatsResponse(total, resolved, topComplaint);
    }
}
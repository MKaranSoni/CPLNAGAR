package com.ecosphere.repository;

import com.ecosphere.entity.Complaint;
import com.ecosphere.entity.ComplaintStatus;
import com.ecosphere.entity.SeverityLevel;
import com.ecosphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository
        extends JpaRepository<Complaint, Long> {
    List<Complaint> findByStatus(ComplaintStatus status);
    List<Complaint> findByCategory(String category);
    List<Complaint> findBySeverity(SeverityLevel severity);
    List<Complaint> findByUser(User user);
    long countByStatus(ComplaintStatus status);
    boolean existsByImageHash(String imageHash);
    long countByCreatedAtAfter(LocalDateTime date);
    long countByStatusAndCreatedAtAfter(
            ComplaintStatus status,
            LocalDateTime date
    );
    List<Complaint> findAllByOrderByCreatedAtDesc();
    
    org.springframework.data.domain.Page<Complaint> findByCityOrderByCreatedAtDesc(String city, org.springframework.data.domain.Pageable pageable);

    List<Complaint> findTop20ByOrderByCreatedAtDesc();

    long countByUser(User user);
    long countByUserAndStatus(User user, ComplaintStatus status);
    Optional<Complaint> findFirstByUserOrderByUpvoteCountDescCreatedAtDesc(User user);

}
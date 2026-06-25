package com.ecosphere.repository;

import com.ecosphere.entity.Complaint;
import com.ecosphere.entity.Upvote;
import com.ecosphere.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UpvoteRepository
        extends JpaRepository<Upvote, Long> {

    Optional<Upvote> findByUserAndComplaint(
            User user,
            Complaint complaint
    );

    long countByComplaint(Complaint complaint);
}
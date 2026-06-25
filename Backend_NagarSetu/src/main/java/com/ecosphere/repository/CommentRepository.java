package com.ecosphere.repository;

import com.ecosphere.entity.Comment;
import com.ecosphere.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByComplaintOrderByCreatedAtAsc(Complaint complaint);
}

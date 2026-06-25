package com.ecosphere.service.impl;

import com.ecosphere.dto.CommentResponse;
import com.ecosphere.dto.CreateCommentRequest;
import com.ecosphere.entity.Comment;
import com.ecosphere.entity.Complaint;
import com.ecosphere.entity.User;
import com.ecosphere.repository.CommentRepository;
import com.ecosphere.repository.ComplaintRepository;
import com.ecosphere.repository.UserRepository;
import com.ecosphere.service.CommentService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public CommentServiceImpl(CommentRepository commentRepository, ComplaintRepository complaintRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<CommentResponse> getComments(Long complaintId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        return commentRepository.findByComplaintOrderByCreatedAtAsc(complaint).stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CommentResponse addComment(Long complaintId, CreateCommentRequest request, String email) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = new Comment();
        comment.setComplaint(complaint);
        comment.setUser(user);
        comment.setMessage(request.getMessage());

        Comment saved = commentRepository.save(comment);
        return convertToResponse(saved);
    }

    private CommentResponse convertToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .userName(comment.getUser().getName())
                .message(comment.getMessage())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}

package com.ecosphere.service;

import com.ecosphere.dto.CommentResponse;
import com.ecosphere.dto.CreateCommentRequest;

import java.util.List;

public interface CommentService {
    List<CommentResponse> getComments(Long complaintId);
    CommentResponse addComment(Long complaintId, CreateCommentRequest request, String email);
}

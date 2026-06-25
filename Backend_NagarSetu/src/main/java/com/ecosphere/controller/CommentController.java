package com.ecosphere.controller;

import com.ecosphere.dto.CommentResponse;
import com.ecosphere.dto.CreateCommentRequest;
import com.ecosphere.service.CommentService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints/{id}/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping
    public List<CommentResponse> getComments(@PathVariable Long id) {
        return commentService.getComments(id);
    }

    @PostMapping
    public CommentResponse addComment(@PathVariable Long id, @RequestBody CreateCommentRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return commentService.addComment(id, request, email);
    }
}

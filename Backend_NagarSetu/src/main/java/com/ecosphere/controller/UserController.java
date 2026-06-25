package com.ecosphere.controller;

import com.ecosphere.dto.UserResponse;
import com.ecosphere.dto.UserStatsResponse;
import com.ecosphere.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserResponse getCurrentUser() {

        return userService.getCurrentUser();
    }

    @GetMapping("/me/stats")
    public UserStatsResponse getUserStats() {
        return userService.getUserStats();
    }
}
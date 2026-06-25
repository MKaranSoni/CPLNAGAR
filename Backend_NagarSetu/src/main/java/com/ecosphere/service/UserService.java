package com.ecosphere.service;

import com.ecosphere.dto.UserResponse;

import com.ecosphere.dto.UserStatsResponse;

public interface UserService {

    UserResponse getCurrentUser();
    UserStatsResponse getUserStats();
}
package com.ecosphere.service;

import com.ecosphere.dto.*;

public interface AuthService {


    AuthResponse login(LoginRequest request);
}
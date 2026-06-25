package com.ecosphere.service.impl;

import com.ecosphere.dto.*;
import com.ecosphere.entity.Role;
import com.ecosphere.entity.User;
import com.ecosphere.repository.UserRepository;
import com.ecosphere.security.JwtService;
import com.ecosphere.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

//    @Override
//    public AuthResponse register(RegisterRequest request) {
//
//        if(userRepository.existsByEmail(request.getEmail())) {
//            throw new RuntimeException("Email already exists");
//        }
//
//        User user = new User();
//
//        user.setName(request.getName());
//        user.setEmail(request.getEmail());
//
//        user.setPassword(
//                passwordEncoder.encode(request.getPassword())
//        );
//
//        user.setRole(Role.CITIZEN);
//
//        userRepository.save(user);
//
//        String token =
//                jwtService.generateToken(user);
//
//        return new AuthResponse(token);
//    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );
        if (!user.isVerified()) {
            throw new RuntimeException(
                    "Please verify your email first"
            );
        }

        boolean matches =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if (!matches) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getRole().name(),
                user.getName(),
                user.getEmail()
        );
    }
}
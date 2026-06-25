package com.ecosphere.service;

import com.ecosphere.dto.VerifyOtpRequest;
import com.ecosphere.entity.OtpVerification;
import com.ecosphere.entity.Role;
import com.ecosphere.entity.User;
import com.ecosphere.repository.UserRepository;
import com.ecosphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ecosphere.repository.OtpRepository;

import java.time.LocalDateTime;

import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class OtpService {

    private final OtpRepository otpRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

//    public OtpService(OtpRepository otpRepository,
//                      EmailService emailService) {
//        this.otpRepository = otpRepository;
//        this.emailService = emailService;
//    }

    public String generateOtp() {
        return String.valueOf((int)(Math.random() * 900000) + 100000);
    }

    public void sendOtp(com.ecosphere.dto.SendOtpRequest request) {
        String email = request.getEmail();
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException(
                    "Email already registered"
            );
        }
        otpRepository.deleteByEmail(email);

        // 1. generate otp
        String otp = generateOtp();

        // 2. save in DB
        OtpVerification record = new OtpVerification();
        record.setEmail(email);
        record.setOtp(otp);
        record.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        record.setUsed(false);
        record.setName(request.getName());
        record.setPassword(request.getPassword());
        record.setWardName(request.getWardName());
        record.setWardNumber(request.getWardNumber());
        record.setLandmark(request.getLandmark());
        record.setArea(request.getArea());
        record.setCity(request.getCity());
        record.setLatitude(request.getLatitude());
        record.setLongitude(request.getLongitude());

        otpRepository.save(record);

        // 3. send email
        emailService.sendOtp(email, otp);
    }
    public void verifyOtpAndRegister(VerifyOtpRequest request) {
        System.out.println("DEBUG: email=" + request.getEmail());
        
        OtpVerification record = otpRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (record.getExpiryTime().isBefore(LocalDateTime.now())) {
            System.out.println("DEBUG: OTP verification result=EXPIRED");
            throw new RuntimeException("OTP expired");
        }

        if (record.isUsed()) {
            System.out.println("DEBUG: OTP verification result=ALREADY_USED");
            throw new RuntimeException("OTP already used");
        }

        // 4. validate OTP
        if (!record.getOtp().equals(request.getOtp())) {
            System.out.println("DEBUG: OTP verification result=INVALID");
            throw new RuntimeException("Invalid OTP");
        }
        System.out.println("DEBUG: OTP verification result=SUCCESS");

        System.out.println("DEBUG: password present?=" + (record.getPassword() != null && !record.getPassword().isEmpty()));
        if (record.getPassword() != null) {
            System.out.println("DEBUG: password length?=" + record.getPassword().length());
        }

        // 5. mark OTP used
        record.setUsed(true);
        otpRepository.save(record);

        // 6. create user
        User user = new User();
        user.setEmail(record.getEmail());
        user.setName(record.getName() != null ? record.getName() : request.getName());
        user.setPassword(
                passwordEncoder.encode(
                        record.getPassword() != null ? record.getPassword() : "default_password_if_null"
                )
        );
        user.setVerified(true);
        user.setRole(Role.CITIZEN);
        user.setWardName(record.getWardName());
        user.setWardNumber(record.getWardNumber());
        user.setLandmark(record.getLandmark());
        user.setArea(record.getArea());
        user.setCity(record.getCity());
        user.setLatitude(record.getLatitude());
        user.setLongitude(record.getLongitude());

        userRepository.save(user);
    }
    public void verifyOtp(VerifyOtpRequest request) {

        OtpVerification record = otpRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        if (record.isUsed()) {
            throw new RuntimeException("OTP already used");
        }

        if (record.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        if (!record.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP");
        }

        record.setUsed(true);
        otpRepository.save(record);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setVerified(true);
        userRepository.save(user);
//        if (!user.isVerified()) {
//            throw new RuntimeException("Please verify OTP first");
//        }
    }
}
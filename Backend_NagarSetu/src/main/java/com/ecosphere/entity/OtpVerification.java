package com.ecosphere.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String otp;

    private LocalDateTime expiryTime;

    private boolean used;

    private String name;

    private String password;

    private String wardName;
    private String wardNumber;
    private String landmark;
    private String area;
    private String city;
    private Double latitude;
    private Double longitude;
}
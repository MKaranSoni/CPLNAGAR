package com.ecosphere.dto;

import lombok.Data;

@Data
public class VerifyOtpRequest {

    private String email;
    private String otp;
    private String name;
    private String password;
}
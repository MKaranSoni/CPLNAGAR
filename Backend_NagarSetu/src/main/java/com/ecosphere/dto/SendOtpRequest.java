package com.ecosphere.dto;

import lombok.Data;

@Data
public class SendOtpRequest {
    private String email;
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
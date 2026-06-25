package com.ecosphere.dto;

import lombok.Data;

@Data
public class CreateComplaintRequest {

    private String title;

    private String description;

    private String city;

    private String landmark;

    private String wardName;

    private String wardNumber;

    private Double latitude;

    private Double longitude;
}
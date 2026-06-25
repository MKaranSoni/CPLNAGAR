package com.ecosphere.service;

public interface AuthenticityService {

    Integer calculateAuthenticity(
            Boolean suspicious,
            Boolean duplicateImage
    );

}
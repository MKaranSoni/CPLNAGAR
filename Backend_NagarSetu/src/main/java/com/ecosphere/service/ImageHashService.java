package com.ecosphere.service;

import org.springframework.web.multipart.MultipartFile;

public interface ImageHashService {

    String generateHash(
            MultipartFile image
    );
}
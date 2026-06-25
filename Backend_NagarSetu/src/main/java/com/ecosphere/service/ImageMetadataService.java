package com.ecosphere.service;

import org.springframework.web.multipart.MultipartFile;

public interface ImageMetadataService {

    boolean isSuspicious(MultipartFile image);
}
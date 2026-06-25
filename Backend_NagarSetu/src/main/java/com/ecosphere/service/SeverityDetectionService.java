package com.ecosphere.service;

import org.springframework.web.multipart.MultipartFile;
import com.ecosphere.entity.SeverityLevel;

public interface SeverityDetectionService {

    SeverityLevel detectSeverity(MultipartFile image, String description);
}

package com.ecosphere.controller;

import com.ecosphere.entity.SeverityLevel;
import com.ecosphere.service.SeverityDetectionService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/test")
public class TestSeverityController {

    private final SeverityDetectionService severityDetectionService;

    public TestSeverityController(
            SeverityDetectionService severityDetectionService
    ) {
        this.severityDetectionService =
                severityDetectionService;
    }

    @PostMapping("/severity")
    public SeverityLevel testSeverity(
            @RequestParam("image") MultipartFile image,
            @RequestParam("description") String description
    ) {

        return severityDetectionService
                .detectSeverity(
                        image,
                        description
                );
    }
}

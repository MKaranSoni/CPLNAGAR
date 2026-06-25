package com.ecosphere.service.impl;
import com.ecosphere.entity.SeverityLevel;
import com.ecosphere.service.SeverityDetectionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import com.ecosphere.dto.gemini.*;
import org.springframework.http.*;
import java.util.Base64;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;
import java.util.Base64;
import java.util.List;

@Service
public class GeminiSeverityDetectionService
        implements SeverityDetectionService {

    private final RestTemplate restTemplate;


    @Value("${gemini.api.key}")
    private String apiKey;
    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    public GeminiSeverityDetectionService(
            RestTemplate restTemplate
    ) {
        this.restTemplate = restTemplate;
    }

    @Override
    public SeverityLevel detectSeverity(
            MultipartFile image,
            String description
    ) {

        try {

            String base64Image =
                    Base64.getEncoder()
                            .encodeToString(
                                    image.getBytes()
                            );
            String prompt = """
Analyze this civic complaint image and description.

Description:
%s

Look at the image also.

Return severity based on actual visible damage.

Return ONLY one word:
LOW
MODERATE
HIGH
CRITICAL

""".formatted(description);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> textPart =
                    Map.of(
                            "text",
                            prompt
                    );


            Map<String, Object> imagePart =
                    Map.of(
                            "inlineData",
                            Map.of(
                                    "mimeType",
                                    image.getContentType(),
                                    "data",
                                    base64Image
                            )
                    );


            Map<String, Object> content =
                    Map.of(
                            "parts",
                            List.of(
                                    textPart,
                                    imagePart
                            )
                    );


            Map<String, Object> requestBody =
                    Map.of(
                            "contents",
                            List.of(content)
                    );

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(
                            requestBody,
                            headers
                    );
            ResponseEntity<GeminiResponse> response =
                    restTemplate.exchange(
                            GEMINI_URL + apiKey,
                            HttpMethod.POST,
                            request,
                            GeminiResponse.class
                    );
            System.out.println(response.getBody());

            System.out.println(
                    "Base64 Generated Successfully"
            );

            System.out.println(
                    base64Image.substring(0, 50)
            );

            System.out.println(response.getBody());

            String severityText =
                    response.getBody()
                            .getCandidates()
                            .get(0)
                            .getContent()
                            .getParts()
                            .get(0)
                            .getText()
                            .trim()
                            .toUpperCase();

            System.out.println(
                    "Predicted Severity: " +
                            severityText
            );

            try {

                return SeverityLevel.valueOf(
                        severityText
                );

            } catch (Exception e) {

                return SeverityLevel.MODERATE;
            }

        } catch (Exception e) {

            e.printStackTrace();

            return SeverityLevel.LOW;
        }
    }
}

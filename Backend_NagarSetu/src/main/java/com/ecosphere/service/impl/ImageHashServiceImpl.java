package com.ecosphere.service.impl;

import com.ecosphere.service.ImageHashService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.MessageDigest;

@Service
public class ImageHashServiceImpl
        implements ImageHashService {

    @Override
    public String generateHash(
            MultipartFile image
    ) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance(
                            "SHA-256"
                    );

            byte[] hash =
                    digest.digest(
                            image.getBytes()
                    );

            StringBuilder sb =
                    new StringBuilder();

            for (byte b : hash) {

                sb.append(
                        String.format(
                                "%02x",
                                b
                        )
                );
            }

            return sb.toString();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Hash generation failed"
            );
        }
    }
}
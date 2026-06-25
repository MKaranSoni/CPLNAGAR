package com.ecosphere.service.impl;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.ecosphere.service.ImageMetadataService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageMetadataServiceImpl
        implements ImageMetadataService {

    @Override
    public boolean isSuspicious(
            MultipartFile image
    ) {

        try {

            Metadata metadata =
                    ImageMetadataReader.readMetadata(
                            image.getInputStream()
                    );

            ExifIFD0Directory directory =
                    metadata.getFirstDirectoryOfType(
                            ExifIFD0Directory.class
                    );

            if (directory == null) {
                return true;
            }

            String software =
                    directory.getString(
                            ExifIFD0Directory.TAG_SOFTWARE
                    );

            if (software != null) {

                software = software.toLowerCase();

                if (software.contains("photoshop")
                        || software.contains("snapseed")
                        || software.contains("picsart")) {

                    return true;
                }
            }

            return false;

        } catch (Exception e) {

            return true;
        }
    }
}
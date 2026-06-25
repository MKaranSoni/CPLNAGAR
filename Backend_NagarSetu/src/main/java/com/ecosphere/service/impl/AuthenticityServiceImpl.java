package com.ecosphere.service.impl;


import com.ecosphere.service.AuthenticityService;
import org.springframework.stereotype.Service;


@Service
public class AuthenticityServiceImpl
        implements AuthenticityService {


    @Override
    public Integer calculateAuthenticity(
            Boolean suspicious,
            Boolean duplicateImage
    ) {


        int score = 100;


        if(Boolean.TRUE.equals(suspicious)) {

            score -= 30;

        }


        if(Boolean.TRUE.equals(duplicateImage)) {

            score -= 50;

        }


        if(score < 0) {

            score = 0;

        }


        return score;

    }
}
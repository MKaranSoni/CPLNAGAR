package com.ecosphere.aqi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ecosphere.aqi.model.AQIresponse;
import com.ecosphere.aqi.model.AQICompareResponse;
import com.ecosphere.aqi.service.AQIservice;

@RestController
@RequestMapping("/api/aqi")
@CrossOrigin
public class AQIcontroller {

    @Autowired
    private AQIservice service;

    // Single location AQI
    @GetMapping("/current")
    public AQIresponse getAQI(
            @RequestParam double lat,
            @RequestParam double lon) {

        return service.getAQI(lat, lon);
    }

    // 🔥 NEW: Compare AQI between two points
    @GetMapping("/compare")
    public AQICompareResponse compareAQI(
            @RequestParam double lat1,
            @RequestParam double lon1,
            @RequestParam double lat2,
            @RequestParam double lon2) {

        return service.compareAQI(lat1, lon1, lat2, lon2);
    }

    // 🔥 NEW: History AQI for trend chart
    @GetMapping("/history")
    public java.util.List<AQIresponse> getAQIHistory(
            @RequestParam double lat,
            @RequestParam double lon) {

        return service.getAQIHistory(lat, lon);
    }
}
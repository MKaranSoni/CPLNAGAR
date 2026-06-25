package com.ecosphere.aqi.report.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

import com.ecosphere.aqi.report.model.*;
import com.ecosphere.aqi.report.service.ReportService;

@RestController
@RequestMapping("/api/report")
@CrossOrigin
public class ReportController {

    @Autowired
    private ReportService service;

    @PostMapping("/monthly")
    public AQIMonthlyreport generateReport(@RequestBody List<AQIRecord> records) {
        return service.generateReport(records);
    }
}
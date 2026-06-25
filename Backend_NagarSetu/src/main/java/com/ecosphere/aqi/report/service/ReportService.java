package com.ecosphere.aqi.report.service;

import org.springframework.stereotype.Service;
import java.util.*;

import com.ecosphere.aqi.report.model.*;

@Service
public class ReportService {

    public AQIMonthlyreport generateReport(List<AQIRecord> records) {

        AQIMonthlyreport report = new AQIMonthlyreport();

        if (records == null || records.isEmpty()) {
            return report;
        }

        int sum = 0;
        int max = Integer.MIN_VALUE;

        for (AQIRecord record : records) {
            sum += record.getAqi();
            max = Math.max(max, record.getAqi());
        }

        double avg = (double) sum / records.size();

        report.setAverageAqi(avg);
        report.setMaxAqi(max);
        report.setCategory(getCategory(avg));
        report.setHealthRisk(getHealthRisk(avg));

        return report;
    }

    private String getCategory(double aqi) {
        if (aqi <= 1.5) return "Good";
        else if (aqi <= 2.5) return "Fair";
        else if (aqi <= 3.5) return "Moderate";
        else if (aqi <= 4.5) return "Poor";
        else return "Very Poor";
    }

    private String getHealthRisk(double aqi) {
        if (aqi <= 1.5) return "Minimal impact";
        else if (aqi <= 2.5) return "Minor breathing discomfort";
        else if (aqi <= 3.5) return "Unhealthy for sensitive groups";
        else if (aqi <= 4.5) return "Breathing issues likely";
        else return "Severe health risk";
    }
}

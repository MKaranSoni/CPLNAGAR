package com.ecosphere.aqi.report.model;

public class AQIMonthlyreport {

    private double averageAqi;
    private int maxAqi;
    private String category;
    private String healthRisk;

    public double getAverageAqi() {
        return averageAqi;
    }

    public void setAverageAqi(double averageAqi) {
        this.averageAqi = averageAqi;
    }

    public int getMaxAqi() {
        return maxAqi;
    }

    public void setMaxAqi(int maxAqi) {
        this.maxAqi = maxAqi;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getHealthRisk() {
        return healthRisk;
    }

    public void setHealthRisk(String healthRisk) {
        this.healthRisk = healthRisk;
    }
}
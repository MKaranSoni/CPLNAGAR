package com.ecosphere.aqi.report.model;

import java.time.LocalDate;

public class AQIRecord {

    private LocalDate date;
    private int aqi;

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public int getAqi() {
        return aqi;
    }

    public void setAqi(int aqi) {
        this.aqi = aqi;
    }
}

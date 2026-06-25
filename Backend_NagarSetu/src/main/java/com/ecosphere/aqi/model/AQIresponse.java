package com.ecosphere.aqi.model;

import java.util.Map;

public class AQIresponse {
    private int aqi;
    private String category;
    private double lat;
    private double lon;
    private long timestamp;
    private String locationName;
    private Map<String, Double> components;

    public int getAqi() { return aqi; }
    public void setAqi(int aqi) { this.aqi = aqi; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }

    public double getLon() { return lon; }
    public void setLon(double lon) { this.lon = lon; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }

    public Map<String, Double> getComponents() { return components; }
    public void setComponents(Map<String, Double> components) { this.components = components; }
}

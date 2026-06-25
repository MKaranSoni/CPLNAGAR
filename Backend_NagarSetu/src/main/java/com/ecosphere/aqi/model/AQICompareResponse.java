package com.ecosphere.aqi.model;

public class AQICompareResponse {

    private AQIresponse from;
    private AQIresponse to;

    private int difference;
    private String recommendation;

    public AQIresponse getFrom() {
        return from;
    }

    public void setFrom(AQIresponse from) {
        this.from = from;
    }

    public AQIresponse getTo() {
        return to;
    }

    public void setTo(AQIresponse to) {
        this.to = to;
    }

    public int getDifference() {
        return difference;
    }

    public void setDifference(int difference) {
        this.difference = difference;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}
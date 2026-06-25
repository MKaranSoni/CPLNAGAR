package com.ecosphere.aqi.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ecosphere.aqi.model.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AQIservice {

    @Value("${openweather.api.key}")
    private String API_KEY;
    
    public AQIresponse getAQI(double lat, double lon) {
        try {
            String url = "https://api.openweathermap.org/data/2.5/air_pollution?lat="
                    + lat + "&lon=" + lon + "&appid=" + API_KEY;

            RestTemplate restTemplate = new RestTemplate();
            Map response = restTemplate.getForObject(url, Map.class);
            List list = (List) response.get("list");
            Map item = (Map) list.get(0);
            
            return parseAqiItem(item, lat, lon);
        }
        catch(Exception e){
            e.printStackTrace();
            throw new RuntimeException("AQI fetch failed");
        }
    }

    public List<AQIresponse> getAQIHistory(double lat, double lon) {
        try {
            long end = System.currentTimeMillis() / 1000;
            long start = end - (24 * 3600); // last 24 hours
            String url = "https://api.openweathermap.org/data/2.5/air_pollution/history?lat="
                    + lat + "&lon=" + lon + "&start=" + start + "&end=" + end + "&appid=" + API_KEY;

            RestTemplate restTemplate = new RestTemplate();
            Map response = restTemplate.getForObject(url, Map.class);
            List list = (List) response.get("list");
            
            List<AQIresponse> result = new ArrayList<>();
            for (Object obj : list) {
                result.add(parseAqiItem((Map) obj, lat, lon));
            }
            return result;
        }
        catch(Exception e){
            e.printStackTrace();
            throw new RuntimeException("AQI history fetch failed");
        }
    }

    private AQIresponse parseAqiItem(Map item, double lat, double lon) {
        Map components = (Map) item.get("components");
        Number pm25Num = (Number) components.get("pm2_5");
        double pm25 = pm25Num != null ? pm25Num.doubleValue() : 0.0;
        
        int usAqi = calculateUsAqi(pm25);
        
        AQIresponse res = new AQIresponse();
        res.setAqi(usAqi);
        res.setCategory(getCategory(usAqi));
        res.setLat(lat);
        res.setLon(lon);
        res.setTimestamp(((Number) item.get("dt")).longValue());
        res.setLocationName(fetchLocationName(lat, lon));
        
        Map<String, Double> compMap = new HashMap<>();
        for (Object key : components.keySet()) {
            compMap.put((String) key, ((Number) components.get(key)).doubleValue());
        }
        res.setComponents(compMap);
        
        return res;
    }

    private String fetchLocationName(double lat, double lon) {
        try {
            String url = "https://api.openweathermap.org/geo/1.0/reverse?lat=" + lat + "&lon=" + lon + "&limit=1&appid=" + API_KEY;
            RestTemplate restTemplate = new RestTemplate();
            List responseList = restTemplate.getForObject(url, List.class);
            if (responseList != null && !responseList.isEmpty()) {
                Map data = (Map) responseList.get(0);
                if (data.containsKey("name")) {
                    return (String) data.get("name");
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to reverse geocode: " + e.getMessage());
        }
        return "Unknown Location";
    }

    private int calculateUsAqi(double pm25) {
        if (pm25 <= 12.0) return calculateSubAqi(pm25, 0.0, 12.0, 0, 50);
        if (pm25 <= 35.4) return calculateSubAqi(pm25, 12.1, 35.4, 51, 100);
        if (pm25 <= 55.4) return calculateSubAqi(pm25, 35.5, 55.4, 101, 150);
        if (pm25 <= 150.4) return calculateSubAqi(pm25, 55.5, 150.4, 151, 200);
        if (pm25 <= 250.4) return calculateSubAqi(pm25, 150.5, 250.4, 201, 300);
        if (pm25 <= 350.4) return calculateSubAqi(pm25, 250.5, 350.4, 301, 400);
        return calculateSubAqi(pm25, 350.5, 500.4, 401, 500);
    }

    private int calculateSubAqi(double cp, double bpLo, double bpHi, int iLo, int iHi) {
        return (int) Math.round(((double)(iHi - iLo) / (bpHi - bpLo)) * (cp - bpLo) + iLo);
    }

    public AQICompareResponse compareAQI(double lat1, double lon1, double lat2, double lon2) {
        AQIresponse from = getAQI(lat1, lon1);
        AQIresponse to = getAQI(lat2, lon2);

        AQICompareResponse response = new AQICompareResponse();
        response.setFrom(from);
        response.setTo(to);
        response.setDifference(to.getAqi() - from.getAqi());
        response.setRecommendation(getRecommendation(from.getAqi(), to.getAqi()));
        return response;
    }

    private String getCategory(int aqi) {
        if (aqi <= 50) return "Good";
        if (aqi <= 100) return "Moderate";
        if (aqi <= 150) return "Poor";
        if (aqi <= 200) return "Unhealthy";
        if (aqi <= 300) return "Severe";
        return "Hazardous";
    }

    private String getRecommendation(int from, int to) {
        if (to <= 50) {
            return "Safe to travel. Air quality is Good.";
        } else if (to <= 100) {
            return "Generally safe, but slightly polluted (Moderate). Sensitive individuals should be careful.";
        } else if (to <= 150) {
            return "Caution advised for sensitive people (Poor). Limit outdoor exposure.";
        } else if (to <= 200) {
            return "Not recommended unless necessary (Unhealthy). Wear an N95 mask.";
        } else {
            return "Avoid travel. Severe/Hazardous pollution risk.";
        }
    }
}
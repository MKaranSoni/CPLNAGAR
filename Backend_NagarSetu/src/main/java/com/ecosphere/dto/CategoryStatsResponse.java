package com.ecosphere.dto;
//
//import lombok.Builder;
//import lombok.Data;
//
//@Data
//@Builder
//public class CategoryStatsResponse package com.ecosphere.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoryStatsResponse {
    private String category;
    private long count;
}
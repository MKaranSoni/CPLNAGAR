package com.ecosphere.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompactComplaintDto {
    private Long id;
    private String title;
    private Integer upvotes;
    private String status;
    private String category;
}

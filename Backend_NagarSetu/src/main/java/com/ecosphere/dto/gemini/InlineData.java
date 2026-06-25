package com.ecosphere.dto.gemini;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InlineData {

    private String mimeType;
    private String data;
}
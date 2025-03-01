package com.openclassrooms.mddapi.payload.response;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class ThemeResponse {
    private Long id;
    private String name;
    private String description;
    private String userEmail;
} 
package com.openclassrooms.mddapi.payload.request;

import lombok.Data;

@Data
public class PostRequest {
    private String title;
    private String content;
    private Long themeId;
} 
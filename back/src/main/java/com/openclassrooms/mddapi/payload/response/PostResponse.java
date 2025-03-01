package com.openclassrooms.mddapi.payload.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String authorEmail;
    private String authorUsername;
    private Long themeId;
    private String themeName;
    private String themeDescription;
    private LocalDateTime createdAt;
    private List<CommentResponse> comments;
} 
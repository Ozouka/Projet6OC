package com.openclassrooms.mddapi.payload.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private String content;
    private String authorEmail;
    private LocalDateTime createdAt;
} 
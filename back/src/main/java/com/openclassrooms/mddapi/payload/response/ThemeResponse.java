package com.openclassrooms.mddapi.payload.response;

import lombok.Data;
import lombok.Builder;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Builder
public class ThemeResponse {
    private Long id;
    private String name;
    private String description;
    private String userEmail;
    
    @JsonProperty("isSubscribed")
    private boolean isSubscribed;
    
    @JsonProperty("subscribed")
    public boolean isSubscribed() {
        return isSubscribed;
    }
} 
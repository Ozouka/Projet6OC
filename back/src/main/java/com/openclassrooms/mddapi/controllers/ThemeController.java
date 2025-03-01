package com.openclassrooms.mddapi.controllers;

import com.openclassrooms.mddapi.payload.request.ThemeRequest;
import com.openclassrooms.mddapi.payload.response.ThemeResponse;
import com.openclassrooms.mddapi.services.ThemeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/themes")
@RequiredArgsConstructor
public class ThemeController {
    private final ThemeService themeService;

    @PostMapping
    public ResponseEntity<?> createTheme(@RequestBody ThemeRequest themeRequest) {
        try {
            ThemeResponse theme = themeService.createTheme(themeRequest.getName(), themeRequest.getDescription());
            return ResponseEntity.ok(theme);
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ThemeResponse>> getAllThemes() {
        return ResponseEntity.ok(themeService.getAllThemes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThemeResponse> getThemeById(@PathVariable Long id) {
        return ResponseEntity.ok(themeService.getThemeById(id));
    }

    @PostMapping("/{themeId}/subscribe")
    public ResponseEntity<?> subscribeToTheme(@PathVariable Long themeId) {
        themeService.subscribeToTheme(themeId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{themeId}/subscribe")
    public ResponseEntity<?> unsubscribeFromTheme(@PathVariable Long themeId) {
        themeService.unsubscribeFromTheme(themeId);
        return ResponseEntity.ok().build();
    }
}

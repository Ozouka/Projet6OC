package com.openclassrooms.mddapi.controllers;

import com.openclassrooms.mddapi.payload.request.ThemeRequest;
import com.openclassrooms.mddapi.payload.response.ThemeResponse;
import com.openclassrooms.mddapi.services.ThemeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/themes")
@RequiredArgsConstructor
@Slf4j
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
        List<ThemeResponse> themes = themeService.getAllThemes();
        log.info("Renvoi de {} thèmes", themes.size());
        return ResponseEntity.ok(themes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ThemeResponse> getThemeById(@PathVariable Long id) {
        ThemeResponse theme = themeService.getThemeById(id);
        log.info("Renvoi du thème: {}, abonné: {}", theme.getName(), theme.isSubscribed());
        return ResponseEntity.ok(theme);
    }

    @PostMapping("/{themeId}/subscribe")
    public ResponseEntity<ThemeResponse> subscribeToTheme(@PathVariable Long themeId) {
        log.info("Demande d'abonnement au thème d'ID: {}", themeId);
        themeService.subscribeToTheme(themeId);
        ThemeResponse updatedTheme = themeService.getThemeById(themeId);
        log.info("Abonnement terminé, état d'abonnement: {}", updatedTheme.isSubscribed());
        return ResponseEntity.ok(updatedTheme);
    }

    @DeleteMapping("/{themeId}/subscribe")
    public ResponseEntity<ThemeResponse> unsubscribeFromTheme(@PathVariable Long themeId) {
        log.info("Demande de désabonnement du thème d'ID: {}", themeId);
        themeService.unsubscribeFromTheme(themeId);
        ThemeResponse updatedTheme = themeService.getThemeById(themeId);
        log.info("Désabonnement terminé, état d'abonnement: {}", updatedTheme.isSubscribed());
        return ResponseEntity.ok(updatedTheme);
    }
}

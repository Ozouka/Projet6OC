package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.models.Theme;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.payload.response.ThemeResponse;
import com.openclassrooms.mddapi.repository.ThemeRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ThemeService {
    private final ThemeRepository themeRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    public ThemeResponse createTheme(String name, String description) {
        try {
            User currentUser = userService.getCurrentUser();
            Theme theme = Theme.builder()
                    .name(name)
                    .description(description)
                    .user(currentUser)
                    .build();
            Theme savedTheme = themeRepository.save(theme);
            
            return ThemeResponse.builder()
                    .id(savedTheme.getId())
                    .name(savedTheme.getName())
                    .description(savedTheme.getDescription())
                    .userEmail(currentUser.getEmail())
                    .build();
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, 
                    "Un thème avec le nom '" + name + "' existe déjà"
            );
        }
    }

    public List<ThemeResponse> getAllThemes() {
        return themeRepository.findAll().stream()
                .map(theme -> ThemeResponse.builder()
                        .id(theme.getId())
                        .name(theme.getName())
                        .description(theme.getDescription())
                        .userEmail(theme.getUser() != null ? theme.getUser().getEmail() : "Utilisateur inconnu")
                        .build())
                .collect(Collectors.toList());
    }

    public ThemeResponse getThemeById(Long id) {
        Theme theme = themeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Theme not found"));
        
        return ThemeResponse.builder()
                .id(theme.getId())
                .name(theme.getName())
                .description(theme.getDescription())
                .userEmail(theme.getUser() != null ? theme.getUser().getEmail() : "Utilisateur inconnu")
                .build();
    }

    public void subscribeToTheme(Long themeId) {
        User currentUser = userService.getCurrentUser();
        Theme theme = themeRepository.findById(themeId)
                .orElseThrow(() -> new EntityNotFoundException("Theme not found"));

        if (currentUser.getSubscriptions().contains(theme)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Vous êtes déjà abonné à ce thème"
            );
        }

        currentUser.getSubscriptions().add(theme);
        userRepository.save(currentUser);
    }

    public void unsubscribeFromTheme(Long themeId) {
        User currentUser = userService.getCurrentUser();
        Theme theme = themeRepository.findById(themeId)
                .orElseThrow(() -> new EntityNotFoundException("Theme not found"));

        if (!currentUser.getSubscriptions().contains(theme)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Vous n'êtes pas abonné à ce thème"
            );
        }

        currentUser.getSubscriptions().remove(theme);
        userRepository.save(currentUser);
    }
} 
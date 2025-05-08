package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.models.Theme;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.payload.response.ThemeResponse;
import com.openclassrooms.mddapi.repository.ThemeRepository;
import com.openclassrooms.mddapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ThemeService {
    private final ThemeRepository themeRepository;
    private final UserService userService;
    private final UserRepository userRepository;

    private boolean isUserSubscribedToTheme(User user, Theme theme) {
        if (user.getId() == null || theme.getId() == null) {
            return false;
        }
        
        return userRepository.isUserSubscribedToTheme(user.getId(), theme.getId());
    }

    @Transactional
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
                    .isSubscribed(false)
                    .build();
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, 
                    "Un thème avec le nom '" + name + "' existe déjà"
            );
        }
    }

    public List<ThemeResponse> getAllThemes() {
        User currentUser = userService.getCurrentUser();
        log.info("Récupération des thèmes pour l'utilisateur: {}", currentUser.getEmail());
        
        List<ThemeResponse> themes = themeRepository.findAll().stream()
                .map(theme -> {
                    boolean isSubscribed = isUserSubscribedToTheme(currentUser, theme);
                    log.info("Thème: {}, Abonné: {}", theme.getName(), isSubscribed);
                    
                    return ThemeResponse.builder()
                            .id(theme.getId())
                            .name(theme.getName())
                            .description(theme.getDescription())
                            .userEmail(theme.getUser() != null ? theme.getUser().getEmail() : "Utilisateur inconnu")
                            .isSubscribed(isSubscribed)
                            .build();
                })
                .collect(Collectors.toList());
        
        return themes;
    }

    public ThemeResponse getThemeById(Long id) {
        User currentUser = userService.getCurrentUser();
        Theme theme = themeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Theme not found"));
        
        boolean isSubscribed = isUserSubscribedToTheme(currentUser, theme);
        log.info("Récupération du thème: {}, Abonné: {}", theme.getName(), isSubscribed);
        
        return ThemeResponse.builder()
                .id(theme.getId())
                .name(theme.getName())
                .description(theme.getDescription())
                .userEmail(theme.getUser() != null ? theme.getUser().getEmail() : "Utilisateur inconnu")
                .isSubscribed(isSubscribed)
                .build();
    }

    @Transactional
    public void subscribeToTheme(Long themeId) {
        User currentUser = userService.getCurrentUser();
        Theme theme = themeRepository.findById(themeId)
                .orElseThrow(() -> new EntityNotFoundException("Theme not found"));

        log.info("Tentative d'abonnement au thème: {} pour l'utilisateur: {}", theme.getName(), currentUser.getEmail());
        
        if (isUserSubscribedToTheme(currentUser, theme)) {
            log.warn("L'utilisateur est déjà abonné à ce thème");
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Vous êtes déjà abonné à ce thème"
            );
        }

        currentUser.getSubscriptions().add(theme);
        userRepository.save(currentUser);
        log.info("Abonnement réussi au thème: {}", theme.getName());
    }

    @Transactional
    public void unsubscribeFromTheme(Long themeId) {
        User currentUser = userService.getCurrentUser();
        Theme theme = themeRepository.findById(themeId)
                .orElseThrow(() -> new EntityNotFoundException("Theme not found"));

        log.info("Tentative de désabonnement du thème: {} pour l'utilisateur: {}", theme.getName(), currentUser.getEmail());
        
        if (!isUserSubscribedToTheme(currentUser, theme)) {
            log.warn("L'utilisateur n'est pas abonné à ce thème");
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Vous n'êtes pas abonné à ce thème"
            );
        }

        // Suppression par ID pour éviter les problèmes de référence d'objet
        currentUser.getSubscriptions().removeIf(t -> t.getId().equals(theme.getId()));
        userRepository.save(currentUser);
        log.info("Désabonnement réussi du thème: {}", theme.getName());
    }
} 
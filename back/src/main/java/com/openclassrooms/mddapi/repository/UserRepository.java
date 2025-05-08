package com.openclassrooms.mddapi.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.openclassrooms.mddapi.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findByEmailOrUsername(String username, String email);

    Boolean existsByEmail(String email);
    
    @Query("SELECT COUNT(s) > 0 FROM User u JOIN u.subscriptions s WHERE u.id = :userId AND s.id = :themeId")
    Boolean isUserSubscribedToTheme(@Param("userId") Long userId, @Param("themeId") Long themeId);
}

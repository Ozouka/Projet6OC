package com.openclassrooms.mddapi.services;

import com.openclassrooms.mddapi.models.Post;
import com.openclassrooms.mddapi.models.Theme;
import com.openclassrooms.mddapi.models.User;
import com.openclassrooms.mddapi.payload.request.PostRequest;
import com.openclassrooms.mddapi.payload.response.PostResponse;
import com.openclassrooms.mddapi.payload.response.CommentResponse;
import com.openclassrooms.mddapi.payload.request.CommentRequest;
import com.openclassrooms.mddapi.models.Comment;
import com.openclassrooms.mddapi.repository.PostRepository;
import com.openclassrooms.mddapi.repository.ThemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final ThemeRepository themeRepository;
    private final UserService userService;

    public PostResponse createPost(PostRequest postRequest) {
        User currentUser = userService.getCurrentUser();
        Theme theme = themeRepository.findById(postRequest.getThemeId())
                .orElseThrow(() -> new EntityNotFoundException("Theme not found"));

        Post post = Post.builder()
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .author(currentUser)
                .theme(theme)
                .createdAt(LocalDateTime.now())
                .comments(new ArrayList<>())
                .build();

        Post savedPost = postRepository.save(post);
        return convertToPostResponse(savedPost);
    }

    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
        return convertToPostResponse(post);
    }

    public List<PostResponse> getFeed() {
        return postRepository.findAll().stream()
                .map(this::convertToPostResponse)
                .collect(Collectors.toList());
    }

    public CommentResponse addComment(Long postId, CommentRequest commentRequest) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        Comment comment = Comment.builder()
                .content(commentRequest.getContent())
                .author(currentUser)
                .post(post)
                .createdAt(LocalDateTime.now())
                .build();

        post.getComments().add(comment);
        postRepository.save(post);

        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorEmail(comment.getAuthor().getEmail())
                .createdAt(comment.getCreatedAt())
                .build();
    }

    private PostResponse convertToPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .authorEmail(post.getAuthor().getEmail())
                .authorUsername(post.getAuthor().getUsername())
                .themeId(post.getTheme().getId())
                .themeName(post.getTheme().getName())
                .themeDescription(post.getTheme().getDescription())
                .createdAt(post.getCreatedAt())
                .comments(post.getComments() != null ? post.getComments().stream()
                        .map(comment -> CommentResponse.builder()
                                .id(comment.getId())
                                .content(comment.getContent())
                                .authorEmail(comment.getAuthor().getEmail())
                                .createdAt(comment.getCreatedAt())
                                .build())
                        .collect(Collectors.toList())
                        : new ArrayList<>())
                .build();
    }
} 
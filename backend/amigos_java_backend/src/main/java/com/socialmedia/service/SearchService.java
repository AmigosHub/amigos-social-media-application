package com.socialmedia.service;

import com.socialmedia.dto.response.PostResponse;
import com.socialmedia.dto.response.UserResponse;
import com.socialmedia.repository.PostRepository;
import com.socialmedia.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final UserService userService;

    public Map<String, List<?>> search(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        // Search users
        List<UserResponse> users = userRepository.searchUsers(query, pageable)
            .getContent().stream()
            .map(user -> {
                UserResponse response = new UserResponse();
                response.setId(user.getId());
                response.setUsername(user.getUsername());
                response.setFullName(user.getFullName());
                response.setProfilePic(user.getProfilePic());
                return response;
            })
            .collect(Collectors.toList());

        // Search posts
        List<PostResponse> posts = postRepository.searchPosts(query, pageable)
            .getContent().stream()
            .map(post -> {
                PostResponse response = new PostResponse();
                response.setId(post.getId());
                response.setContent(post.getContent());
                response.setMediaUrl(post.getMediaUrl());
                response.setMediaType(post.getMediaType());
                response.setCreatedAt(post.getCreatedAt());
                
                UserResponse userResponse = new UserResponse();
                userResponse.setId(post.getUser().getId());
                userResponse.setUsername(post.getUser().getUsername());
                userResponse.setFullName(post.getUser().getFullName());
                userResponse.setProfilePic(post.getUser().getProfilePic());
                response.setUser(userResponse);
                
                return response;
            })
            .collect(Collectors.toList());

        return Map.of(
            "users", users,
            "posts", posts
        );
    }
}
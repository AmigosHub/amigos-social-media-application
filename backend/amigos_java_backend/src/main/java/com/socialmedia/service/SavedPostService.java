package com.socialmedia.service;

import com.socialmedia.common.enums.FollowStatus;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.dto.response.PostResponse;
import com.socialmedia.dto.response.UserResponse;
import com.socialmedia.entity.Post;
import com.socialmedia.entity.SavedPost;
import com.socialmedia.entity.User;
import com.socialmedia.exception.BadRequestException;
import com.socialmedia.exception.ResourceNotFoundException;
import com.socialmedia.repository.FollowRepository;
import com.socialmedia.repository.LikeRepository;
import com.socialmedia.repository.PostRepository;
import com.socialmedia.repository.SavedPostRepository;
import com.socialmedia.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SavedPostService {

    private final SavedPostRepository savedPostRepository;
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final FollowRepository followRepository;
    private final UserService userService;

    @Transactional
    public void savePost(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (savedPostRepository.existsByUserAndPost(currentUser, post)) {
            throw new BadRequestException("Post already saved");
        }

        SavedPost savedPost = new SavedPost();
        savedPost.setUser(currentUser);
        savedPost.setPost(post);
        savedPostRepository.save(savedPost);
        log.info("User {} saved post {}", currentUser.getUsername(), postId);
    }

    @Transactional
    public void unsavePost(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        savedPostRepository.deleteByUserAndPost(currentUser, post);
        log.info("User {} unsaved post {}", currentUser.getUsername(), postId);
    }

    @Transactional(readOnly = true)
    public PageResponse<PostResponse> getSavedPosts(int page, int size) {
        User currentUser = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<SavedPost> savedPosts = savedPostRepository.findByUserOrderBySavedAtDesc(currentUser, pageable);

        List<PostResponse> postResponses = savedPosts.getContent().stream()
            .map(savedPost -> {
                // The post is already loaded within the transaction
                Post post = savedPost.getPost();
                return mapToPostResponse(post);
            })
            .collect(Collectors.toList());

        return PageResponse.<PostResponse>builder()
            .content(postResponses)
            .pageNumber(savedPosts.getNumber())
            .pageSize(savedPosts.getSize())
            .totalElements(savedPosts.getTotalElements())
            .totalPages(savedPosts.getTotalPages())
            .last(savedPosts.isLast())
            .build();
    }

    @Transactional(readOnly = true)
    public boolean isSavedByCurrentUser(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return savedPostRepository.existsByUserAndPost(currentUser, post);
    }

    /**
     * Map Post entity to PostResponse DTO manually to avoid LazyInitializationException
     */
    private PostResponse mapToPostResponse(Post post) {
        User currentUser = userService.getCurrentUser();
        
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setContent(post.getContent());
        response.setMediaUrl(post.getMediaUrl());
        response.setMediaType(post.getMediaType());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());

        // Map user manually
        User postUser = post.getUser();
        UserResponse userResponse = new UserResponse();
        userResponse.setId(postUser.getId());
        userResponse.setUsername(postUser.getUsername());
        userResponse.setEmail(postUser.getEmail());
        userResponse.setFullName(postUser.getFullName());
        userResponse.setBio(postUser.getBio());
        userResponse.setProfilePic(postUser.getProfilePic());
        userResponse.setPrivate(postUser.isPrivate());
        userResponse.setActive(postUser.isActive());
        userResponse.setLastSeen(postUser.getLastSeen());
        userResponse.setFollowersCount(followRepository.countByFollowingAndStatus(postUser, FollowStatus.ACCEPTED));
        userResponse.setFollowingCount(followRepository.countByFollowerAndStatus(postUser, FollowStatus.ACCEPTED));
        userResponse.setPostsCount(postRepository.countByUser(postUser));
        response.setUser(userResponse);

        // Counts from database
        response.setLikesCount(likeRepository.countByPost(post));
        response.setCommentsCount(commentRepository.countByPost(post));

        // Interaction status for current user
        if (currentUser != null) {
            response.setLikedByCurrentUser(likeRepository.existsByUserAndPost(currentUser, post));
            response.setSavedByCurrentUser(true); // Since this is from saved posts
        }

        return response;
    }
}
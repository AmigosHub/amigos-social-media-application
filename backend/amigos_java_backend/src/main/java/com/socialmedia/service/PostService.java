package com.socialmedia.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.socialmedia.common.enums.FollowStatus;
import com.socialmedia.dto.request.PostRequest;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.dto.response.PostResponse;
import com.socialmedia.dto.response.UserResponse;
import com.socialmedia.entity.Like;
import com.socialmedia.entity.Post;
import com.socialmedia.entity.User;
import com.socialmedia.exception.BadRequestException;
import com.socialmedia.exception.ResourceNotFoundException;
import com.socialmedia.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FollowRepository followRepository;
    private final LikeRepository likeRepository;
    private final SavedPostRepository savedPostRepository;
    private final CommentRepository commentRepository;
    private final BlockedUserRepository blockedUserRepository;
    private final Cloudinary cloudinary;
    private final UserService userService;

    @Transactional
    public PostResponse createPost(PostRequest request) {
        User user = userService.getCurrentUser();

        String mediaUrl = null;
        String mediaType = "NONE";

        if (request.getMedia() != null && !request.getMedia().isEmpty()) {
            MultipartFile file = request.getMedia();
            String contentType = file.getContentType();

            if (contentType != null && contentType.startsWith("image/")) {
                mediaType = "IMAGE";
            } else if (contentType != null && contentType.startsWith("video/")) {
                mediaType = "VIDEO";
            } else {
                throw new BadRequestException("Unsupported file type. Only images and videos are allowed.");
            }

            try {
                Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                        "folder", "social_media/posts",
                        "resource_type", "auto",
                        "quality", "auto:best"
                    )
                );
                mediaUrl = uploadResult.get("secure_url").toString();
            } catch (IOException e) {
                log.error("Failed to upload file to Cloudinary", e);
                throw new BadRequestException("Failed to upload media: " + e.getMessage());
            }
        }

        Post post = new Post();
        post.setContent(request.getContent() != null ? request.getContent() : "");
        post.setMediaUrl(mediaUrl);
        post.setMediaType(mediaType);
        post.setUser(user);

        Post savedPost = postRepository.save(post);
        log.info("Post created successfully by user: {}", user.getUsername());

        return mapToPostResponse(savedPost);
    }

    @Transactional(readOnly = true)
    public PageResponse<PostResponse> getFeed(int page, int size) {
        User currentUser = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);

        // Get users that current user follows
        List<User> followingUsers = followRepository.findFollowingUsers(currentUser);
        // Add current user to see own posts
        followingUsers.add(currentUser);

        Page<Post> posts = postRepository.findPostsByUsers(followingUsers, pageable);

        List<PostResponse> postResponses = posts.getContent().stream()
            .map(this::mapToPostResponse)
            .collect(Collectors.toList());

        return PageResponse.<PostResponse>builder()
            .content(postResponses)
            .pageNumber(posts.getNumber())
            .pageSize(posts.getSize())
            .totalElements(posts.getTotalElements())
            .totalPages(posts.getTotalPages())
            .last(posts.isLast())
            .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<PostResponse> getUserPosts(Long userId, int page, int size) {
        User currentUser = userService.getCurrentUser();
        User targetUser = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Pageable pageable = PageRequest.of(page, size);

        // Check if user is blocked
        if (blockedUserRepository.existsByBlockerAndBlockedUser(currentUser, targetUser) ||
            blockedUserRepository.existsByBlockerAndBlockedUser(targetUser, currentUser)) {
            throw new BadRequestException("Cannot view posts");
        }

        Page<Post> posts = postRepository.findByUserOrderByCreatedAtDesc(targetUser, pageable);

        List<PostResponse> postResponses = posts.getContent().stream()
            .map(this::mapToPostResponse)
            .collect(Collectors.toList());

        return PageResponse.<PostResponse>builder()
            .content(postResponses)
            .pageNumber(posts.getNumber())
            .pageSize(posts.getSize())
            .totalElements(posts.getTotalElements())
            .totalPages(posts.getTotalPages())
            .last(posts.isLast())
            .build();
    }

    @Transactional(readOnly = true)
    public PostResponse getPost(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        // Check if post creator is blocked
        User postOwner = post.getUser();
        if (blockedUserRepository.existsByBlockerAndBlockedUser(currentUser, postOwner) ||
            blockedUserRepository.existsByBlockerAndBlockedUser(postOwner, currentUser)) {
            throw new BadRequestException("Cannot view this post");
        }

        return mapToPostResponse(post);
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getPostLikes(Long postId, int page, int size) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        
        User currentUser = userService.getCurrentUser();
        Pageable pageable = PageRequest.of(page, size);
        Page<Like> likes = likeRepository.findByPostOrderByCreatedAtDesc(post, pageable);
        
        List<UserResponse> userResponses = likes.getContent().stream()
            .map(like -> mapToUserResponse(like.getUser()))
            .collect(Collectors.toList());
        
        return PageResponse.<UserResponse>builder()
            .content(userResponses)
            .pageNumber(likes.getNumber())
            .pageSize(likes.getSize())
            .totalElements(likes.getTotalElements())
            .totalPages(likes.getTotalPages())
            .last(likes.isLast())
            .build();
    }

    @Transactional
    public PostResponse updatePost(Long postId, PostRequest request) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You don't have permission to edit this post");
        }

        if (request.getContent() != null) {
            post.setContent(request.getContent());
        }

        // Handle media update if provided
        if (request.getMedia() != null && !request.getMedia().isEmpty()) {
            MultipartFile file = request.getMedia();
            try {
                Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                        "folder", "social_media/posts",
                        "resource_type", "auto",
                        "quality", "auto:best"
                    )
                );
                String mediaUrl = uploadResult.get("secure_url").toString();
                post.setMediaUrl(mediaUrl);
                post.setMediaType(file.getContentType() != null && file.getContentType().startsWith("video/") ? "VIDEO" : "IMAGE");
            } catch (IOException e) {
                log.error("Failed to upload file to Cloudinary", e);
                throw new BadRequestException("Failed to upload media");
            }
        }

        Post updatedPost = postRepository.save(post);
        log.info("Post updated: {}", postId);
        return mapToPostResponse(updatedPost);
    }

    @Transactional
    public void deletePost(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You don't have permission to delete this post");
        }

        postRepository.delete(post);
        log.info("Post deleted: {}", postId);
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
        UserResponse userResponse = mapToUserResponse(postUser);
        response.setUser(userResponse);

        // Counts from database
        response.setLikesCount(likeRepository.countByPost(post));
        response.setCommentsCount(commentRepository.countByPost(post));

        // Interaction status for current user
        if (currentUser != null) {
            response.setLikedByCurrentUser(likeRepository.existsByUserAndPost(currentUser, post));
            response.setSavedByCurrentUser(savedPostRepository.existsByUserAndPost(currentUser, post));
        }

        return response;
    }

    /**
     * Map User entity to UserResponse DTO manually
     */
    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setBio(user.getBio());
        response.setProfilePic(user.getProfilePic());
        response.setPrivate(user.isPrivate());
        response.setActive(user.isActive());
        response.setLastSeen(user.getLastSeen());
        response.setFollowersCount(followRepository.countByFollowingAndStatus(user, FollowStatus.ACCEPTED));
        response.setFollowingCount(followRepository.countByFollowerAndStatus(user, FollowStatus.ACCEPTED));
        response.setPostsCount(postRepository.countByUser(user));
        return response;
    }
}
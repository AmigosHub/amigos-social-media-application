package com.socialmedia.service;

import com.socialmedia.common.enums.FollowStatus;
import com.socialmedia.common.enums.NotificationType;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.dto.response.UserResponse;
import com.socialmedia.entity.Like;
import com.socialmedia.entity.Notification;
import com.socialmedia.entity.Post;
import com.socialmedia.entity.User;
import com.socialmedia.exception.BadRequestException;
import com.socialmedia.exception.ResourceNotFoundException;
import com.socialmedia.repository.FollowRepository;
import com.socialmedia.repository.LikeRepository;
import com.socialmedia.repository.NotificationRepository;
import com.socialmedia.repository.PostRepository;
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
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final NotificationRepository notificationRepository;
    private final FollowRepository followRepository;
    private final UserService userService;

    @Transactional
    public void likePost(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (likeRepository.existsByUserAndPost(currentUser, post)) {
            throw new BadRequestException("You already liked this post");
        }

        Like like = new Like();
        like.setUser(currentUser);
        like.setPost(post);
        likeRepository.save(like);

        // Create notification if current user is not the post owner
        if (!currentUser.getId().equals(post.getUser().getId())) {
            Notification notification = new Notification();
            notification.setReceiver(post.getUser());
            notification.setSender(currentUser);
            notification.setPost(post);
            notification.setType(NotificationType.POST_LIKED);
            notification.setMessage(currentUser.getFullName() + " liked your post");
            notificationRepository.save(notification);
        }

        log.info("User {} liked post {}", currentUser.getUsername(), postId);
    }

    @Transactional
    public void unlikePost(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        likeRepository.deleteByUserAndPost(currentUser, post);
        log.info("User {} unliked post {}", currentUser.getUsername(), postId);
    }

    @Transactional(readOnly = true)
    public long getPostLikeCount(Long postId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return likeRepository.countByPost(post);
    }

    @Transactional(readOnly = true)
    public boolean isLikedByCurrentUser(Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return likeRepository.existsByUserAndPost(currentUser, post);
    }

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> getPostLikes(Long postId, int page, int size) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        
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

    /**
     * Map User entity to UserResponse DTO manually to avoid LazyInitializationException
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
        return response;
    }
}
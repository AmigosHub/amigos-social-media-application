package com.socialmedia.service;

import com.socialmedia.common.enums.FollowStatus;
import com.socialmedia.common.enums.NotificationType;
import com.socialmedia.dto.request.CommentRequest;
import com.socialmedia.dto.response.CommentResponse;
import com.socialmedia.dto.response.PageResponse;
import com.socialmedia.dto.response.UserResponse;
import com.socialmedia.entity.Comment;
import com.socialmedia.entity.Notification;
import com.socialmedia.entity.Post;
import com.socialmedia.entity.User;
import com.socialmedia.exception.BadRequestException;
import com.socialmedia.exception.ResourceNotFoundException;
import com.socialmedia.repository.CommentRepository;
import com.socialmedia.repository.FollowRepository;
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
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final NotificationRepository notificationRepository;
    private final FollowRepository followRepository;
    private final UserService userService;

    @Transactional
    public CommentResponse createComment(CommentRequest request, Long postId) {
        User currentUser = userService.getCurrentUser();
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setPost(post);
        comment.setUser(currentUser);

        // Handle reply
        if (request.getParentId() != null) {
            Comment parent = commentRepository.findById(request.getParentId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
            comment.setParent(parent);
        }

        Comment savedComment = commentRepository.save(comment);

        // Create notification
        if (!currentUser.getId().equals(post.getUser().getId())) {
            Notification notification = new Notification();
            notification.setReceiver(post.getUser());
            notification.setSender(currentUser);
            notification.setPost(post);
            notification.setComment(savedComment);

            if (request.getParentId() != null) {
                notification.setType(NotificationType.COMMENT_REPLIED);
                notification.setMessage(currentUser.getFullName() + " replied to a comment on your post");
            } else {
                notification.setType(NotificationType.POST_COMMENTED);
                notification.setMessage(currentUser.getFullName() + " commented on your post");
            }

            notificationRepository.save(notification);
        }

        log.info("User {} commented on post {}", currentUser.getUsername(), postId);
        return mapToCommentResponse(savedComment);
    }

    @Transactional
    public CommentResponse createReply(Long parentCommentId, CommentRequest request) {
        User currentUser = userService.getCurrentUser();
        Comment parentComment = commentRepository.findById(parentCommentId)
            .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
        
        Post post = parentComment.getPost();
        
        Comment reply = new Comment();
        reply.setContent(request.getContent());
        reply.setPost(post);
        reply.setUser(currentUser);
        reply.setParent(parentComment);
        
        Comment savedReply = commentRepository.save(reply);

        // Create notification for reply
        if (!currentUser.getId().equals(parentComment.getUser().getId())) {
            Notification notification = new Notification();
            notification.setReceiver(parentComment.getUser());
            notification.setSender(currentUser);
            notification.setPost(post);
            notification.setComment(savedReply);
            notification.setType(NotificationType.COMMENT_REPLIED);
            notification.setMessage(currentUser.getFullName() + " replied to your comment");
            notificationRepository.save(notification);
        }

        log.info("Reply created by user {} on comment {}", currentUser.getUsername(), parentCommentId);
        return mapToCommentResponse(savedReply);
    }

    @Transactional
    public CommentResponse updateComment(Long commentId, String content) {
        User currentUser = userService.getCurrentUser();
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You don't have permission to edit this comment");
        }

        comment.setContent(content);
        comment.setEdited(true);
        Comment updatedComment = commentRepository.save(comment);

        log.info("Comment {} updated by user {}", commentId, currentUser.getUsername());
        return mapToCommentResponse(updatedComment);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        User currentUser = userService.getCurrentUser();
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You don't have permission to delete this comment");
        }

        commentRepository.delete(comment);
        log.info("Comment {} deleted by user {}", commentId, currentUser.getUsername());
    }

    @Transactional(readOnly = true)
    public PageResponse<CommentResponse> getPostComments(Long postId, int page, int size) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> comments = commentRepository.findByPostAndParentIsNullOrderByCreatedAtDesc(post, pageable);

        List<CommentResponse> commentResponses = comments.getContent().stream()
            .map(this::mapToCommentResponse)
            .collect(Collectors.toList());

        return PageResponse.<CommentResponse>builder()
            .content(commentResponses)
            .pageNumber(comments.getNumber())
            .pageSize(comments.getSize())
            .totalElements(comments.getTotalElements())
            .totalPages(comments.getTotalPages())
            .last(comments.isLast())
            .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<CommentResponse> getCommentReplies(Long commentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Comment> replies = commentRepository.findByParentIdOrderByCreatedAtDesc(commentId, pageable);

        List<CommentResponse> replyResponses = replies.getContent().stream()
            .map(this::mapToCommentResponse)
            .collect(Collectors.toList());

        return PageResponse.<CommentResponse>builder()
            .content(replyResponses)
            .pageNumber(replies.getNumber())
            .pageSize(replies.getSize())
            .totalElements(replies.getTotalElements())
            .totalPages(replies.getTotalPages())
            .last(replies.isLast())
            .build();
    }

    /**
     * Map Comment entity to CommentResponse DTO manually to avoid LazyInitializationException
     */
    private CommentResponse mapToCommentResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setEdited(comment.isEdited());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());

        // Map user manually
        User user = comment.getUser();
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setUsername(user.getUsername());
        userResponse.setEmail(user.getEmail());
        userResponse.setFullName(user.getFullName());
        userResponse.setBio(user.getBio());
        userResponse.setProfilePic(user.getProfilePic());
        userResponse.setPrivate(user.isPrivate());
        userResponse.setActive(user.isActive());
        userResponse.setLastSeen(user.getLastSeen());
        userResponse.setFollowersCount(followRepository.countByFollowingAndStatus(user, FollowStatus.ACCEPTED));
        userResponse.setFollowingCount(followRepository.countByFollowerAndStatus(user, FollowStatus.ACCEPTED));
        response.setUser(userResponse);

        // Map replies only if the collection is initialized
        if (org.hibernate.Hibernate.isInitialized(comment.getReplies()) && comment.getReplies() != null) {
            List<CommentResponse> replies = comment.getReplies().stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
            response.setReplies(replies);
        }

        return response;
    }
}
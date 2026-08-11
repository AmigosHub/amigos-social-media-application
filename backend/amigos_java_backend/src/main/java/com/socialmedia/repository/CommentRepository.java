package com.socialmedia.repository;

import com.socialmedia.entity.Comment;
import com.socialmedia.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByPostAndParentIsNullOrderByCreatedAtDesc(Post post, Pageable pageable);

    Page<Comment> findByPostOrderByCreatedAtDesc(Post post, Pageable pageable);

    Page<Comment> findByParentIdOrderByCreatedAtDesc(Long parentId, Pageable pageable);

    long countByPost(Post post);
}
package com.socialmedia.repository;

import com.socialmedia.entity.SavedPost;
import com.socialmedia.entity.Post;
import com.socialmedia.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SavedPostRepository extends JpaRepository<SavedPost, Long> {

    Optional<SavedPost> findByUserAndPost(User user, Post post);

    boolean existsByUserAndPost(User user, Post post);

    void deleteByUserAndPost(User user, Post post);

    Page<SavedPost> findByUserOrderBySavedAtDesc(User user, Pageable pageable);

    long countByPost(Post post);
}